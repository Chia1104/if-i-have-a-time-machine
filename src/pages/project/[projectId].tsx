import { type NextPage, type GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";

const ProjectPage: NextPage = () => {
  return (
    <div className="ctw-component-container main gap-5 pt-20">Project Page</div>
  );
};

export default ProjectPage;
