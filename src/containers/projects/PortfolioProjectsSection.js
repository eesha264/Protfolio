import React, {useContext, useMemo, useState} from "react";
import "../StartupProjects/StartupProjects.scss";
import {bigProjects} from "../../portfolio";
import {Fade} from "react-reveal";
import StyleContext from "../../contexts/StyleContext";
import {usePortfolioProjects} from "../../hooks/usePortfolioProjects";
import {ensureHttpsUrl} from "../../utils/projectsRemote";

function ProjectCardImage({src, alt, isDark, featured}) {
  const [broken, setBroken] = useState(false);
  const showImg = src && !broken;
  const initial = String(alt || "?").trim().charAt(0) || "?";

  return (
    <div
      className={`project-image${featured ? " project-image-featured" : ""}`}
    >
      {showImg ? (
        <img
          src={src}
          alt={alt || "Project thumbnail"}
          className="card-image"
          onError={() => setBroken(true)}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className={
            isDark
              ? "project-image-placeholder project-image-placeholder-dark"
              : "project-image-placeholder"
          }
          aria-hidden
        >
          <span className="project-image-placeholder-label">{initial}</span>
        </div>
      )}
    </div>
  );
}

function PortfolioProjectCard({project, isDark, featured}) {
  const githubHref = ensureHttpsUrl(project.githubUrl);
  const demoHref = ensureHttpsUrl(project.liveDemoUrl);

  const cardClass = [
    "project-card",
    isDark ? "dark-mode project-card-dark" : "project-card-light",
    featured ? "project-card-featured" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass}>
      {featured ? (
        <span className="featured-project-badge">Featured Project</span>
      ) : null}
      <ProjectCardImage
        src={project.image || ""}
        alt={project.projectName}
        isDark={isDark}
        featured={featured}
      />
      <div className="project-detail">
        <h5 className={isDark ? "dark-mode card-title" : "card-title"}>
          {project.projectName}
        </h5>
        {project.projectDesc ? (
          <p className={isDark ? "dark-mode card-subtitle" : "card-subtitle"}>
            {project.projectDesc}
          </p>
        ) : null}
        {(githubHref || demoHref) && (
          <div className="project-card-actions">
            {githubHref ? (
              <a
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isDark
                    ? "dark-mode project-action-btn project-action-github"
                    : "project-action-btn project-action-github"
                }
              >
                GitHub
              </a>
            ) : null}
            {demoHref ? (
              <a
                href={demoHref}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isDark
                    ? "dark-mode project-action-btn project-action-demo"
                    : "project-action-demo project-action-btn"
                }
              >
                Live Demo
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedSkeletonCard({isDark}) {
  return (
    <div
      className={
        isDark
          ? "dark-mode project-card project-card-dark project-card-skeleton project-card-featured project-card-featured-skeleton"
          : "project-card project-card-light project-card-skeleton project-card-featured project-card-featured-skeleton"
      }
    >
      <div className="project-skeleton-shimmer project-skeleton-image featured" />
      <div className="project-skeleton-shimmer project-skeleton-line title" />
      <div className="project-skeleton-shimmer project-skeleton-line wide" />
      <div className="project-skeleton-actions">
        <span className="project-skeleton-shimmer project-skeleton-btn" />
        <span className="project-skeleton-shimmer project-skeleton-btn" />
      </div>
    </div>
  );
}

/**
 * Portfolio project cards: featured rows from portfolio.js + Google Sheets (see projectsRemote.js).
 * Lives under Projects.js → #opensource only.
 */
export default function PortfolioProjectsSection() {
  const {isDark} = useContext(StyleContext);
  const {projects, loading} = usePortfolioProjects(bigProjects);

  const {featuredProjects, gridProjects} = useMemo(() => {
    const featured = [];
    const grid = [];
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      if (p.featured) {
        featured.push(p);
      } else {
        grid.push(p);
      }
    }
    return {featuredProjects: featured, gridProjects: grid};
  }, [projects]);

  if (!bigProjects.display) {
    return null;
  }

  return (
    <Fade bottom duration={1000} distance="20px">
      <div className="portfolio-projects-block">
        <div>
          <h1 className="skills-heading">{bigProjects.title}</h1>
          <p
            className={
              isDark
                ? "dark-mode project-subtitle"
                : "subTitle project-subtitle"
            }
          >
            {bigProjects.subtitle}
          </p>

          {loading ? (
            <div
              className="projects-loading"
              aria-busy="true"
              aria-live="polite"
            >
              <div className="featured-projects-row featured-projects-row-skeleton">
                <FeaturedSkeletonCard isDark={isDark} />
                <FeaturedSkeletonCard isDark={isDark} />
              </div>
              <div className="projects-container projects-skeleton-grid">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={
                      isDark
                        ? "dark-mode project-card project-card-dark project-card-skeleton"
                        : "project-card project-card-light project-card-skeleton"
                    }
                  >
                    <div className="project-skeleton-shimmer project-skeleton-image" />
                    <div className="project-skeleton-shimmer project-skeleton-line title" />
                    <div className="project-skeleton-shimmer project-skeleton-line wide" />
                    <div className="project-skeleton-actions">
                      <span className="project-skeleton-shimmer project-skeleton-btn" />
                      <span className="project-skeleton-shimmer project-skeleton-btn" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!loading && (
            <>
              {featuredProjects.length > 0 ? (
                <div className="featured-projects-row">
                  {featuredProjects.map(project => (
                    <PortfolioProjectCard
                      key={project.id}
                      project={project}
                      isDark={isDark}
                      featured={true}
                    />
                  ))}
                </div>
              ) : null}

              {gridProjects.length > 0 ? (
                <div className="projects-container projects-grid-standard">
                  {gridProjects.map(project => (
                    <PortfolioProjectCard
                      key={project.id}
                      project={project}
                      isDark={isDark}
                      featured={false}
                    />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Fade>
  );
}
