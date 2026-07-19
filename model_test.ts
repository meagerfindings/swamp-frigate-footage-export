import { assertEquals, assertStringIncludes, assertThrows } from "jsr:@std/assert@1";
import { buildExportName, buildExportPlan, normalizeApiBase, toEvent } from "./model.ts";

Deno.test("buildExportPlan de-duplicates cameras and provides a named request per camera", () => {
  const plan = buildExportPlan({ topic: "package review", cameras: ["front", "front", "driveway"], startTime: 100, endTime: 200, playback: "realtime", source: "recordings", chapters: "recording_segments" });
  assertEquals(plan.items.length, 2);
  assertEquals(plan.items.map((item) => item.camera), ["front", "driveway"]);
  assertStringIncludes(plan.items[0].name, "package review");
});

Deno.test("buildExportPlan rejects an inverted time window", () => {
  assertThrows(() => buildExportPlan({ topic: "test", cameras: ["front"], startTime: 200, endTime: 100, playback: "realtime", source: "recordings", chapters: null }));
});

Deno.test("helpers normalize URL and event metadata", () => {
  assertEquals(normalizeApiBase("https://frigate.example.com/api///"), "https://frigate.example.com/api");
  assertStringIncludes(buildExportName("a/b", "front door", 0), "a-b");
  assertEquals(toEvent({ id: "event1", camera: "front", label: "person", start_time: 1, end_time: null, has_clip: 1, has_snapshot: 0, zones: ["porch"], data: { max_severity: "alert" } }), { id: "event1", camera: "front", label: "person", startTime: 1, endTime: null, hasClip: true, hasSnapshot: false, zones: ["porch"], severity: "alert" });
});
