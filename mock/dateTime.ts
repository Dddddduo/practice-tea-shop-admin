import {Request, Response} from 'express';

const dateTime = (req: Request, res: Response) => {
  res.json({
    code: 0,
    msg: 'success',
    data: [
      {
        startDate: '2024-01-05 21:22',
        endDate: '2024-01-05 23:35'
      },
      {
        startDate: '2024-02-05 12:30',
        endDate: '2024-02-05 17:55'
      },
    ],
  });
};

export default {
  'GET /api/dateTime': dateTime,
};
