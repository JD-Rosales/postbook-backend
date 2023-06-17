const whitelist = [
  'http://localhost:5173',
  'https://friendly-croissant-e5dcc5.netlify.app',
];

const corsOption = {
  origin: function (origin: any, callback: (arg0: any, arg1: any) => void) {
    if (!origin || whitelist.indexOf(origin as string) !== -1) {
      callback(null, true);
      console.log(origin, 'is allowed by CORS');
    } else {
      console.log(origin, 'is block by CORS');
    }
  },
  credentials: true,
};

export default corsOption;
