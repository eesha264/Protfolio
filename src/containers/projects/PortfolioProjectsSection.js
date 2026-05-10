import React, {useContext, useMemo, useState} from "react";
import "../StartupProjects/StartupProjects.scss";
import {bigProjects} from "../../portfolio";
import {Fade} from "react-reveal";
import StyleContext from "../../contexts/StyleContext";
import {usePortfolioProjects} from "../../hooks/usePortfolioProjects";
import {ensureHttpsUrl} from "../../utils/projectsRemote";

/** Sheet rows whose Project Name is exactly Zync or PackPal render in the featured row (case-insensitive). */
const FEATURED_TITLES = new Set(["zync", "packpal"]);
const FEATURED_SORT_ORDER = {zync: 0, packpal: 1};

function partitionSheetProjects(projects) {
  const featured = [];
  const grid = [];
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const key = String(p.projectName || "")
      .trim()
      .toLowerCase();
    if (FEATURED_TITLES.has(key)) {
      featured.push(p);
    } else {
      grid.push(p);
    }
  }
  featured.sort(
    (a, b) =>
      (FEATURED_SORT_ORDER[
        String(a.projectName || "")
          .trim()
          .toLowerCase()
      ] ?? 99) -
      (FEATURED_SORT_ORDER[
        String(b.projectName || "")
          .trim()
          .toLowerCase()
      ] ?? 99)
  );
  return {featuredProjects: featured, gridProjects: grid};
}

/**
 * Fixed 16:9 media area — identical for every card regardless of source image dimensions.
 * Maps to: w-full aspect-[16/9] overflow-hidden rounded-t-xl + inner img object-cover.
 */
function ProjectCardMedia({src, alt, isDark}) {
  const [broken, setBroken] = useState(false);
  const showImg = Boolean(src) && !broken;
  const initial = String(alt || "?").trim().charAt(0) || "?";

  return (
    <div className="project-card-media">
      <div className="project-card-media-inner">
        {showImg ? (
          <>
            <img
              src={src}
              alt={alt || "Project thumbnail"}
              className="project-card-media-img"
              onError={() => setBroken(true)}
              loading="lazy"
              decoding="async"
            />
            <div className="project-card-media-overlay" aria-hidden />
          </>
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
    </div>
  );
}

function PortfolioProjectCard({project, isDark, featured}) {
  const githubHref = ensureHttpsUrl(project.githubUrl);
  const demoHref = ensureHttpsUrl(project.liveDemoUrl);

  const cardClass = [
    "project-card",
    "project-card-group",
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
      <ProjectCardMedia
        src={project.image || ""}
        alt={project.projectName}
        isDark={isDark}
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
          <div className="project-card-actions-icons">
            {githubHref ? (
              <a
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`project-card-icon-link${isDark ? " dark-mode" : ""}`}
                aria-label={`${project.projectName} GitHub repository`}
              >
                <i className="fab fa-github" aria-hidden />
              </a>
            ) : null}
            {demoHref ? (
              <a
                href={demoHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`project-card-icon-link project-card-icon-link--demo${isDark ? " dark-mode" : ""}`}
                aria-label={`${project.projectName} live demo`}
              >
                <span className="project-card-icon-arrow" aria-hidden>
                  ↗
                </span>
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
          ? "dark-mode project-card project-card-group project-card-dark project-card-skeleton project-card-featured project-card-featured-skeleton"
          : "project-card project-card-group project-card-light project-card-skeleton project-card-featured project-card-featured-skeleton"
      }
    >
      <div className="project-skeleton-media">
        <div className="project-skeleton-shimmer project-skeleton-media-fill" />
      </div>
      <div className="project-card-skeleton-inner">
        <div className="project-skeleton-shimmer project-skeleton-line title" />
        <div className="project-skeleton-shimmer project-skeleton-line wide" />
        <div className="project-card-actions-icons project-card-actions-icons--skeleton">
          <span className="project-skeleton-shimmer project-skeleton-icon-dot" />
          <span className="project-skeleton-shimmer project-skeleton-icon-dot" />
        </div>
      </div>
    </div>
  );
}

/**
 * Projects under #opensource: sheet-driven; Zync & PackPal featured by title match.
 * All cards share the same 16:9 media + icon link UI.
 */
export default function PortfolioProjectsSection() {
  const {isDark} = useContext(StyleContext);
  const {projects, loading} = usePortfolioProjects();

  const {featuredProjects, gridProjects} = useMemo(
    () => partitionSheetProjects(projects),
    [projects]
  );

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
                        ? "dark-mode project-card project-card-group project-card-dark project-card-skeleton"
                        : "project-card project-card-group project-card-light project-card-skeleton"
                    }
                  >
                    <div className="project-skeleton-media">
                      <div className="project-skeleton-shimmer project-skeleton-media-fill" />
                    </div>
                    <div className="project-card-skeleton-inner">
                      <div className="project-skeleton-shimmer project-skeleton-line title" />
                      <div className="project-skeleton-shimmer project-skeleton-line wide" />
                      <div className="project-card-actions-icons project-card-actions-icons--skeleton">
                        <span className="project-skeleton-shimmer project-skeleton-icon-dot" />
                        <span className="project-skeleton-shimmer project-skeleton-icon-dot" />
                      </div>
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
