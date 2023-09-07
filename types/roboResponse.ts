// A helpful type to pass additional information (like @'s)
// along with the message text in a response.
export type RoboResponse = {
    message: string;
    attachments: any;
};