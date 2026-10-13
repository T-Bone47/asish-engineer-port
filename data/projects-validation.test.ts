import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import type { ProjectLinksVisibility } from "@/types/project";

/**
 * BUILD-TIME CONTENT VALIDATION GATE
 *
 * Catches malformed or contradictory project data before it can ship. Each
 * assertion below corresponds to a rule the data must satisfy — when it
 * fails, the error message names the exact project and exactly what is
 * wrong, so a failed build is a to-do list rather than an opaque failure.
 *
 * This is deliberately separate from the integrity tests in projects.test.ts
 * (which check for malformed/duplicated data at the lookup level) and from
 * the storytelling-depth tests (which check narrative quality). This gate
 * checks *content validity against the data model and owner action items*.
 *
 * Visibility rules:
 *  - A project with `links.visibility === "unpublished"` is exempt from the
 *    external-link requirement. Its links object may be empty. This is how
 *    genuinely private or unpublishable projects (e.g. Sentinel AI, whose
 *    canonical repository is not public under this GitHub account) stay in
 *    the catalogue without forcing a fabricated link.
 *  - A project with `links.visibility === "public"` (or with no visibility
 *    declared, which defaults to expecting public links) must have at least
 *    one of `repository` / `demo` / `documentation` present and valid.
 *  - Any link that IS present must be a valid absolute HTTPS URL. We never
 *    relax that — a present but malformed URL is worse than no URL.
 *
 * When all gaps are closed and the model is sound, this file is deleted
 * rather than emptied: a passing gate that still exists is maintenance
 * burden, and the header documents why it was removed.
 */

type MissingField = {
  projectId: string;
  projectSlug: string;
  field: string;
  detail: string;
};

const missing: MissingField[] = [];

/** ---------- External links (visibility-aware) ---------- */

for (const project of projects) {
  const links = project.links;
  const visibility: ProjectLinksVisibility = links.visibility ?? "public";

  if (visibility === "unpublished") {
    // Unpublished projects are allowed to have empty links. Still, if they
    // do carry a link, it must be valid — never publish a malformed URL even
    // on a project that is otherwise private.
    for (const [key, url] of Object.entries(links)) {
      if (key === "visibility") continue;
      if (!url) continue;
      if (!/^https:\/\//.test(url)) {
        missing.push({
          projectId: project.id,
          projectSlug: project.slug,
          field: `links.${key}`,
          detail: `declared ${key} URL "${url}" is not a valid absolute HTTPS URL`,
        });
      }
    }
    continue;
  }

  // Public (or default-to-public) project: at least one real link required.
  const hasRepository = typeof links.repository === "string" && links.repository.length > 0;
  const hasDemo = typeof links.demo === "string" && links.demo.length > 0;
  const hasDocumentation =
    typeof links.documentation === "string" && links.documentation.length > 0;

  if (!hasRepository && !hasDemo && !hasDocumentation) {
    missing.push({
      projectId: project.id,
      projectSlug: project.slug,
      field: "links",
      detail: `visibility is "public" (or unset) but no repository / demo / documentation URL is present — at least one valid external link is needed`,
    });
  }

  // Validate any link that IS present.
  for (const [key, url] of Object.entries(links)) {
    if (key === "visibility") continue;
    if (!url) continue;
    if (!/^https:\/\//.test(url)) {
      missing.push({
        projectId: project.id,
        projectSlug: project.slug,
        field: `links.${key}`,
        detail: `declared ${key} URL "${url}" is not a valid absolute HTTPS URL`,
      });
    }
  }
}

/** ---------- Year ---------- */

for (const project of projects) {
  if (project.year === "TBD") {
    missing.push({
      projectId: project.id,
      projectSlug: project.slug,
      field: "year",
      detail: 'year is "TBD" — replace with a real four-digit year (or a documented reason it is genuinely unknown, recorded outside the sentinel)',
    });
  } else if (!/^\d{4}$/.test(project.year)) {
    missing.push({
      projectId: project.id,
      projectSlug: project.slug,
      field: "year",
      detail: `year "${project.year}" is not a valid four-digit year`,
    });
  }
}

/** ---------- Technologies ---------- */

for (const project of projects) {
  if (!project.technologies || project.technologies.length === 0) {
    missing.push({
      projectId: project.id,
      projectSlug: project.slug,
      field: "technologies",
      detail: "no technologies array — the project cannot render its technology chips or case-study technologies section",
    });
  } else {
    for (let i = 0; i < project.technologies.length; i++) {
      const tech = project.technologies[i];
      if (!tech || tech.trim() === "") {
        missing.push({
          projectId: project.id,
          projectSlug: project.slug,
          field: `technologies[${i}]`,
          detail: `technology entry at index ${i} is empty`,
        });
      }
    }
  }
}

/** ---------- Identity: no duplicate ids or slugs ---------- */

const ids = projects.map((p) => p.id);
const slugs = projects.map((p) => p.slug);
if (new Set(ids).size !== ids.length) {
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  missing.push({
    projectId: "catalogue",
    projectSlug: "catalogue",
    field: "id",
    detail: `duplicate project ids found: ${[...new Set(dupes)].join(", ")}`,
  });
}
if (new Set(slugs).size !== slugs.length) {
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  missing.push({
    projectId: "catalogue",
    projectSlug: "catalogue",
    field: "slug",
    detail: `duplicate project slugs found: ${[...new Set(dupes)].join(", ")}`,
  });
}

/** ---------- Report ---------- */

function reportMissing() {
  if (missing.length === 0) return;

  console.log("\n=== BUILD BLOCKED: incomplete or invalid project data ===\n");

  const byProject = new Map<string, MissingField[]>();
  for (const m of missing) {
    const list = byProject.get(m.projectId) ?? [];
    list.push(m);
    byProject.set(m.projectId, list);
  }

  for (const [id, fields] of byProject) {
    const first = fields[0];
    if (!first) continue;
    const slug = first.projectSlug;
    console.log(`· ${id} (${slug})`);
    for (const f of fields) {
      console.log(`    - ${f.field}: ${f.detail}`);
    }
  }

  console.log(
    `\n${missing.length} missing/invalid field${missing.length === 1 ? "" : "s"} across ${byProject.size} project${byProject.size === 1 ? "" : "s"}.\nFix the data in data/projects.ts, then re-run the build.\n`
  );
}

describe("project completeness — build-time content gate", () => {
  it("every project satisfies the content validation rules", () => {
    reportMissing();
    expect(
      missing,
      "incomplete or invalid project data — see the list printed above"
    ).toEqual([]);
  });
});
