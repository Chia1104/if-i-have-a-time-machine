import { type FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="ctw-component-bg-secondary flex flex-col items-center justify-center gap-3 py-8 px-10 text-gray-500 dark:border-t dark:border-gray-700">
      <p>
        The project is still under development. If you want to help, please send
        me <a href="mailto:yuyuchia7423@gmail.com">Email</a>
      </p>
      <div className="flex">
        <p>
          The website is built with
          <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
            <img
              src="/nextjs.svg"
              alt="next.js"
              className="mx-2 mb-1 inline h-4"
            />
          </a>
          framework, and deployed on
          <a href="https://zeabur.com/" target="_blank" rel="noreferrer">
            <img
              src="/zeabur.svg"
              alt="zeabur"
              className="mx-2 mb-1 inline h-4"
            />
          </a>{" "}
          platform.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
