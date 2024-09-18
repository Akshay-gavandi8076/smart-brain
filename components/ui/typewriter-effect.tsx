"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";

interface TypewriterEffectProps {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  words,
  className,
  cursorClassName,
}) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        },
      );
    }
  }, [isInView, animate]);

  return (
    <div
      className={cn(
        "text-center text-base font-bold sm:text-xl md:text-3xl lg:text-5xl",
        className,
      )}
    >
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => (
          <div key={`word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <motion.span
                key={`char-${index}`}
                initial={{ opacity: 0 }}
                className={cn(
                  "hidden text-5xl font-bold text-black opacity-0 dark:text-white md:text-6xl lg:text-7xl",
                  word.className,
                )}
              >
                {char}
              </motion.span>
            ))}
            &nbsp;
          </div>
        ))}
      </motion.div>
      <Cursor cursorClassName={cursorClassName} />
    </div>
  );
};

const Cursor: React.FC<{ cursorClassName?: string }> = ({
  cursorClassName,
}) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    className={cn(
      "inline-block h-10 w-[4px] rounded-sm bg-blue-500 md:h-11 lg:h-14",
      cursorClassName,
    )}
  />
);

export const TypewriterEffectSmooth: React.FC<TypewriterEffectProps> = ({
  words,
  className,
  cursorClassName,
}) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  return (
    <div className={cn("my-6 flex space-x-1", className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{ width: "0%" }}
        whileInView={{ width: "fit-content" }}
        transition={{ duration: 2, ease: "linear", delay: 1 }}
      >
        <div
          className="lg:text:3xl text-xs font-bold sm:text-base md:text-xl xl:text-5xl"
          style={{ whiteSpace: "nowrap" }}
        >
          {wordsArray.map((word, idx) => (
            <span key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn("text-black dark:text-white", word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </span>
          ))}
        </div>
      </motion.div>
      <Cursor cursorClassName={cursorClassName} />
    </div>
  );
};
