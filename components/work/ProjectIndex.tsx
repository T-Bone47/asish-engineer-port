import { projects, getIndexProjects, getFlagshipProject } from "@/data/projects";
import { ProjectIndexRow } from "@/components/work/ProjectIndexRow";
import { FlagshipProject } from "@/components/work/FlagshipProject";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/**
 * /work index.
 *
 * An evidence-backed flagship block, then every other project as a row.
 * Previously all seven were identical rows, so the project carrying real
 * measured numbers had the same visual weight as the projects carrying
 * none.
 *
 * Row numbers are the catalogue position from `data/projects.ts` — the
 * same number the case-study hero shows. They used to restart at 01 for
 * the remaining set, which meant a row labelled 01 on /work opened a case
 * study labelled 02.
 *
 * `getIndexProjects()` already excludes the flagship, so this component
 * cannot double-render it. The number is a catalogue position, never a
 * rank — no project is labelled "best" or "#1".
 */
export function ProjectIndex() {
  const flagship = getFlagshipProject();
  const indexProjects = getIndexProjects();

  return (
    <div>
      {flagship && <FlagshipProject project={flagship} index={0} />}

      <div className={flagship ? "mt-16" : ""}>
        <div className="flex items-baseline gap-4 border-b border-border-strong pb-3">
          <TechnicalLabel as="h2">
            {flagship ? "All Other Systems" : "Selected Systems"}
          </TechnicalLabel>
          <span className="font-technical text-[11px] tabular-nums text-foreground-faint">
            {String(indexProjects.length).padStart(2, "0")}
          </span>
        </div>

        {/* `.reveal-group` staggers the rows as they enter the viewport
            rather than flashing nine at once — the one place on the site
            where a group stagger carries meaning (there are nine systems
            and the count matters). Each row keeps its own hover/focus
            language; only the entrance is grouped. */}
        <ol className="reveal-group border-t border-border-subtle">
          {indexProjects.map((project) => (
            <li key={project.id}>
              <ProjectIndexRow
                project={project}
                index={projects.findIndex((p) => p.id === project.id)}
                headingLevel="h3"
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
