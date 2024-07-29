import { NextApiRequest, NextApiResponse } from 'next';
import { google, calendar_v3 } from 'googleapis';

const calendar = google.calendar('v3');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, date, time } = req.body;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const eventStartTime = `${date}T${time}:00-07:00`; // Adjust the timezone as needed
    const eventEndTime = new Date(new Date(eventStartTime).getTime() + 30 * 60000).toISOString(); // End time 30 minutes later

    const event: calendar_v3.Schema$Event = {
      summary: `Onboarding meeting with ${name}`,
      start: {
        dateTime: eventStartTime,
        timeZone: 'America/Los_Angeles', // Adjust the timezone as needed
      },
      end: {
        dateTime: eventEndTime,
        timeZone: 'America/Los_Angeles', // Adjust the timezone as needed
      },
      attendees: [{ email }, { email: 'your_email@example.com' }],
    };

    try {
      await calendar.events.insert({
        auth: oAuth2Client,
        calendarId: 'primary',
        requestBody: event,
      });
      res.status(200).json({ message: 'Calendar invite sent' });
    } catch (error) {
      console.error('Error creating calendar event:', error);
      res.status(500).json({ error: 'Error creating calendar event' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
