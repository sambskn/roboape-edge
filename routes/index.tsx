/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getResponseForMessage } from "./api/gmCallback.tsx";

interface Data {
  roboResp: string | undefined;
  msg: string;
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url =new URL(req.url)
    const msg = url.searchParams.get("msg") || "";
    
    // simulate robo ape response using same function (without posting)
    const roboResp = getResponseForMessage(msg);
    
    return ctx.render({roboResp, msg});
  }
}

export default function Home({ data }: PageProps<Data> ) {
  const { roboResp, msg } = data;
  return (
    <div class={tw`h-screen p-10 flex-col bg-gradient-to-b from-yellow-200 via-green-200 to-green-300`}>
      <div class={tw`text-center`}>
        <h2 class={tw`text-lg font-bold`}>
          welcome to the robo ape zone
        </h2>
        <h6 class={tw`text-md font-light italic`}>
            is it comfortable here?
        </h6>
      </div>
      <div class={tw`p-10 mt-3 w-100 text-left`}>
        <form>
          <p class={tw`mb-2 font-semibold`}>
            enter your test message:
          </p>
          <input type="text" name="msg" value={msg} class={tw`p-2 rounded border mr-3`}/>
          <button type="submit" class={tw`p-2 bg-gray-300 rounded`}>see what ape say</button>
        </form>
        
      </div>
      <div class={tw`p-10 mt-3 w-100 text-right`}>
        <h2 class={tw`text-md font-bold italic`}>
          robo ape would respond thusly:
        </h2>
        <h6 class={tw`p-5 text-md font-light italic font-serif ${roboResp ? '' : 'text-pink-800'}`}>
            {roboResp ? `"${roboResp}"` : "ROBO APE would not respond to this, out of poor mood or ignorance"}
        </h6>
      </div>
      <footer>
        <a>see inside roboape</a>
      </footer>
    </div>
  );
}
