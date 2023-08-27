import { component$, useSignal } from "@builder.io/qwik";
import { globalAction$, type DocumentHead } from "@builder.io/qwik-city";
import * as screenshotone from "screenshotone-api-sdk";

export const useTakeScreenshot = globalAction$(async (data, { fail, env }) => {
  const url = data.url.toString();
  console.log(`taking screenshot of url: ${url}`);

  const screenshotOnAccessKey = env.get("SCREENSHOTONE_ACCESS_KEY")!;
  const screenshotOneSecretKey = env.get("SCREENSHOTONE_SECRET_KEY")!;

  const client = new screenshotone.Client(
    screenshotOnAccessKey,
    screenshotOneSecretKey
  );

  const options = screenshotone.TakeOptions.url(url)
    .delay(1)
    .blockAds(true)
    .blockCookieBanners(true)
    .blockTrackers(true)
    .format("webp");

  try {
    await client.take(options);
  } catch (e) {
    return fail(424, { message: `Failed to take a screenshot - ${e}` });
  }

  return {
    message: 'SUCCESS!'
  };
});

export default component$(() => {
  const status = useSignal('');
  const takeScreenshot = useTakeScreenshot();
  return (
    <>

      <div class="container container-center container-spacing-xl grid gap-4">
        <input
            onFocusout$={async (e) => {
              const input = e.target.value;
              if (!input) return;
              status.value = 'taking screenshot...'
              const result = await takeScreenshot.submit({
                url: input
              });
              if (result.value.failed) {
                status.value = result.value.message!;
                return;
              }
              status.value = result.value.message!;
            }}
            type="text"
            name="application-url"
            id="application-url"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="put a url hear and focus out"
          />
          <div>
            <span>Status: </span>
            <span>{status.value}</span>
          </div>
      </div>


    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
