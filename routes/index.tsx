/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getResponseForMessage } from "./api/gmCallback.tsx";
import { GroupmeCallback } from "../types/groupmeCallback.ts"

interface Data {
  roboResp: string | undefined;
  msg: string;
  acctId: string;
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url)
    const msg = url.searchParams.get("msg") || "";
    const acctId = url.searchParams.get("account") || "";

    // simulate robo ape response using same function (without posting)
    const messageObj: GroupmeCallback = {
      attachments: [],
      avatar_url: "",
      created_at: 0,
      group_id: "",
      id: "",
      name: "Robert",
      sender_id: acctId,
      sender_type: "",
      source_guid: "",
      system: false,
      text: msg,
      user_id: ""
    }

    const roboResp = getResponseForMessage(messageObj);

    return ctx.render({ roboResp, msg, acctId });
  }
}

export default function Home({ data }: PageProps<Data>) {
  const { roboResp, msg, acctId } = data;
  return (
    <div class={tw`h-screen p-10 flex flex-col bg-gradient-to-b from-yellow-200 via-green-200 to-green-300`}>
      <div class={tw`flex-auto h-full`}>
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
            <div class={tw`flex flex-row`}>
              <div class={tw`flex flex-col`}>
                <p class={tw`mb-2 font-semibold`}>
                  enter your test message:
                </p>
                <input type="text" name="msg" value={msg} class={tw`p-2 rounded border mr-3`} />
                <p class={tw`my-2 italic`}>
                  set your chances (for rolls)
                </p>
                <select name="account" value={acctId} class={tw`p-2 bg-blue-800 rounded text-white`}>
                  <option value="default">default 🦍</option>
                  <option value="123456">luke 💁‍♂️</option>
                  <option value="unlucky">unlucky 😢</option>
                  <option value="lucky">lucky 😏</option>
                  <option value="fucked">fucked 🥴</option>
                  <option value="alumni">alumni 🧓</option>
                </select>
                <button type="submit" class={tw`p-2 my-4 h-12 bg-indigo-300 rounded`}>see what ape say</button>
              </div>
            </div>
          </form>
        </div>

        {msg !== "" && <div class={tw`p-10 mt-3 w-100 text-righ flex flex-col items-end`}>
          <h2 class={tw`mb-2 font-semibold`}>
            robo ape may respond thusly:
          </h2>
          <h6 class={tw`max-w-md p-5 text-md font-light italic font-serif ${roboResp ? '' : 'text-pink-800'} bg-gray-50 rounded border-gray-300`}>
            {
              roboResp ? `"${roboResp.message}"` : "ROBO APE would not respond to this, out of poor mood or ignorance"
            }
          </h6>
        </div>}

      </div>
      <footer class={tw`text-center text-purple-800 underline `}>
        <a href="https://github.com/sambskn/roboape-edge" target="_blank" rel="noopener noreferrer">see inside roboape</a>
      </footer>
    </div>
  );
}
