import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const calendar = google.calendar('v3');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { timeMin, timeMax } = req.query;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    try {
      const response = await calendar.events.list({
        auth: oAuth2Client,
        calendarId: 'primary',
        timeMin: timeMin as string,
        timeMax: timeMax as string,
        singleEvents: true,
        orderBy: 'startTime',
      });

      res.status(200).json(response.data.items);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      res.status(500).json({ error: 'Error fetching calendar events' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
