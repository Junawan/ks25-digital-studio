"use client";

import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

type LoveStoryProps = {
  stories: {
    year: string;
    title: string;
    description: string;
    image?: string;
  }[];
};

export default function LoveStory({
  stories,
}: LoveStoryProps) {

  const theme = useTheme();

  if (!stories?.length) return null;

  return (
    <section
    id="story"
className="
py-10
relative
"
>

      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center">

          <div className="relative w-40 h-40 mx-auto mb-6">

  <img
    src={theme.loveStory.frame}
    alt=""
    className="absolute inset-0 w-full h-full object-contain"
  />

  <div
    className="
    absolute
    inset-0
    flex
    items-center
    justify-center
    "
  >
    <span
      className={`
      text-4xl
      ${theme.loveStory.iconColor}
      `}
    >
      {theme.loveStory.icon}
    </span>
  </div>

</div>

          <h2 className={`
text-4xl
${theme.font.title}
${theme.text.primary}
`}>
            Love Story
          </h2>

          <img
            src={theme.loveStory.divider}
            className="w-56 mx-auto mt-4"
          />

        </div>

        <div className="mt-14 space-y-10">

          {stories.map((story, index) => (

            <div
              key={index}
              className={`
rounded-3xl
overflow-hidden
${theme.loveStory.card}
`}
            >

              {story.image && (

                <div
  className={`
flex
justify-center
items-center
p-5
${theme.loveStory.imageWrapper}
`}
>
  <img
    src={story.image}
    alt={story.title}
    className={`
w-full
h-auto
rounded-2xl
border
${theme.loveStory.imageBorder}
`}
  />
</div>

              )}

              <div className="p-8">

                <p
                  className={`
tracking-[4px]
uppercase
text-xs
${theme.font.title}
${theme.text.primary}
`}
                >
                  {story.year}
                </p>

                <h3
                  className={`
text-3xl
mt-2
${theme.font.title}
${theme.text.primary}
`}
                >
                  {story.title}
                </h3>

                <p
                  className={`
mt-5
leading-8
text-xl
${theme.font.body}
${theme.text.body}
`}
                >
                  {story.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}