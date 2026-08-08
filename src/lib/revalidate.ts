import { revalidatePath } from "next/cache";

export function revalidateLibrary() {
  revalidatePath("/");
  revalidatePath("/projects");
}
