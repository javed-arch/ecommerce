import connectDb from "./db.js";

const startServer = async (app, port, url) => {
  try {
    //database config
    connectDb(url);

    //run listen
    app.listen(port, () => {
      console.log(
        `Server Running on ${process.env.NODE_ENV} mode on port ${port}`
      );
    });
  } catch (err) {
    console.log(`Error in Server Connection ${err}`);
  }
};

export { startServer };
