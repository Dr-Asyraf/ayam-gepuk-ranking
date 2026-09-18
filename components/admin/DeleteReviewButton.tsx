"use client";

type DeleteReviewButtonProps = {
  visitId: string;
};

export default function DeleteReviewButton({
  visitId,
}: DeleteReviewButtonProps) {
  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review? This cannot be undone.",
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <form
      action={`/admin/reviews/${visitId}/delete`}
      method="POST"
      onSubmit={handleDelete}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
