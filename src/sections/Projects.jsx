import { useId, useState } from 'react'
import { projects } from '../data/site'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import ProjectVisual from '../components/ProjectVisual'
import { Plus } from '../components/Icons'
import './Projects.css'

export default function Projects() {
  // One row open at a time; the first is open on load so the section never
  // reads as an empty list of labels.
  const [open, setOpen] = useState(projects[0].id)
  const baseId = useId()

  return (
    <section className="section projects" id="work" aria-labelledby={`${baseId}-label`}>
      <div className="shell">
        <SectionHeader
          index="02"
          label="Selected Work"
          note="Five engagements from the last three years. Client names withheld where the work is still under wraps."
          id={`${baseId}-label`}
        />

        <ul className="projects__list">
          {projects.map((project, i) => {
            const isOpen = open === project.id
            const panelId = `${baseId}-panel-${project.id}`
            const btnId = `${baseId}-btn-${project.id}`

            return (
              <Reveal as="li" key={project.id} delay={i * 70} className="project">
                <div className={`project__inner ${isOpen ? 'is-open' : ''}`}>
                  <h3 className="project__heading">
                    <button
                      id={btnId}
                      type="button"
                      className="project__summary"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : project.id)}
                    >
                      <span className="mono project__id">{project.id}</span>
                      <span className="project__name">{project.name}</span>
                      <span className="project__tagline">{project.tagline}</span>
                      <span className="mono project__category">{project.category}</span>
                      <span className="mono project__year">{project.year}</span>
                      <span className="project__toggle" aria-hidden="true">
                        <Plus width="14" height="14" />
                      </span>
                    </button>
                  </h3>

                  <div id={panelId} role="region" aria-labelledby={btnId} className="project__panel">
                    {/* The clip layer keeps the panel's padding from adding
                        height while the row is collapsed. */}
                    <div className="project__panel-clip">
                      <div className="project__panel-inner">
                        <div className="project__detail">
                          <p className="project__description">{project.description}</p>

                          <dl className="project__facts">
                            {[
                              ['Year', project.year],
                              ['Discipline', project.category],
                              ['Engagement', project.duration],
                            ].map(([k, v]) => (
                              <div key={k}>
                                <dt className="mono">{k}</dt>
                                <dd className="mono">{v}</dd>
                              </div>
                            ))}
                          </dl>

                          <ul className="project__scope">
                            {project.scope.map((s) => (
                              <li className="mono" key={s}>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <ProjectVisual variant={project.visual} />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
