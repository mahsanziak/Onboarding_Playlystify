import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const calendar = google.calendar('v3');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { eventId } = req.query;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    try {
      await calendar.events.delete({
        auth: oAuth2Client,
        calendarId: 'primary',
        eventId: eventId as string,
      });

      res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Error deleting event' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
