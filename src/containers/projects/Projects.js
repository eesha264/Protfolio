import React, {useState, useEffect, useContext, Suspense, lazy} from "react";
import "./Project.scss";
import Button from "../../components/button/Button";
import {bigProjects, openSource, socialMediaLinks} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import Loading from "../../containers/loading/Loading";
import PortfolioProjectsSection from "./PortfolioProjectsSection";

const GithubRepoCard = lazy(() =>
  import("../../components/githubRepoCard/GithubRepoCard")
);

export default function Projects() {
  const renderLoader = () => <Loading />;
  const [repo, setrepo] = useState([]);
  const {isDark} = useContext(StyleContext);

  useEffect(() => {
    const getRepoData = () => {
      fetch("/profile.json")
        .then(result => {
          if (result.ok) {
            return result.json();
          }
          throw result;
        })
        .then(response => {
          setrepo(response.data.user.pinnedItems.edges);
        })
        .catch(function (error) {
          console.error(
            `${error} (because of this error, nothing is shown in place of GitHub pinned repos. Also check if Projects section has been configured)`
          );
          setrepo("Error");
        });
    };
    getRepoData();
  }, []);

  const githubPinnedReady =
    !(typeof repo === "string" || repo instanceof String) &&
    Array.isArray(repo) &&
    repo.length > 0;

  const showGithubPinned = openSource.display && githubPinnedReady;

  if (!bigProjects.display && !showGithubPinned) {
    return null;
  }

  return (
    <div className="main" id="opensource">
      {bigProjects.display ? <PortfolioProjectsSection /> : null}

      {showGithubPinned ? (
        <Suspense fallback={renderLoader()}>
          <h1
            className={`project-title${bigProjects.display ? " opensource-github-heading" : ""}`}
          >
            Open Source Projects
          </h1>
          <div className="repo-cards-div-main">
            {repo.map((v, i) => {
              if (!v) {
                console.error(
                  `Github Object for repository number : ${i} is undefined`
                );
              }
              return (
                <GithubRepoCard repo={v} key={v.node.id} isDark={isDark} />
              );
            })}
          </div>
          <Button
            text={"More Projects"}
            className="project-button"
            href={socialMediaLinks.github}
            newTab={true}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
