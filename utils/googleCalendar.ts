import { google, calendar_v3 } from 'googleapis';

interface FormData {
  name: string;
  email: string;
  date: string;
}

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const calendar = google.calendar('v3');

export async function sendCalendarInvite({ name, email, date }: FormData) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  const event: calendar_v3.Schema$Event = {
    summary: `Onboarding meeting with ${name}`,
    start: {
      dateTime: `${date}T10:00:00-07:00`,
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: `${date}T10:30:00-07:00`,
      timeZone: 'America/Los_Angeles',
    },
    attendees: [{ email }, { email: 'your_email@example.com' }],
  };

  try {
    await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: 'primary',
      requestBody: event,
    });
    console.log('Calendar invite sent');
  } catch (error) {
    console.error('Error creating calendar event:', error);
  }
}
