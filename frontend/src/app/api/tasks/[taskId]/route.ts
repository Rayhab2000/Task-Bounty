import { getTask } from "@/lib/task-workflow";
import { buildNoStoreJson } from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { taskId } = await context.params;
  const result = getTask(taskId);

  if (!result.ok) {
    return buildNoStoreJson(
      {
        ok: false,
        error: result.error,
      },
      result.status,
    );
  }

  return buildNoStoreJson(
    {
      ok: true,
      task: result.task,
    },
    200,
  );
}
