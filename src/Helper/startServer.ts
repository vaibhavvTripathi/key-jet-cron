import dbConnect from "./dbConnect";

export const startServer = async (port: number) => {
  try {
    console.log("starting server");
    await dbConnect();
    console.log(`sever is listening to the port ${port}`);
  } catch (err) {
    console.log("error while starting server : " + err);
  }
};
