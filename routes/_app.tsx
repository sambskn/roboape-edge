/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>the robo ape zone</title>
        <meta name="description" content="the testing grounds for the ape" />
        <link rel="icon" type="image/x-icon" href={asset('/logo.ico')}></link>
      </Head>
      <props.Component />
    </>
  );
}