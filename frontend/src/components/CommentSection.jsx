import { useState } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';

import useAuth from '../hooks/useAuth';
import { api } from '../lib/api';
import { formatDate, formatRole } from '../lib/formatters';

function CommentSection({ recipeId, comments, onRefresh }) {
  const { token, user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitComment = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.createComment(recipeId, { content }, token);
      setContent('');
      await onRefresh?.();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.deleteComment(recipeId, commentId, token);
      await onRefresh?.();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Комментарии</h3>
        </div>
        <div className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">
          {comments.length} шт.
        </div>
      </div>

      {user ? (
        <form onSubmit={submitComment} className="mt-6">
          <label className="block text-sm font-medium text-slate-700">
            Написать комментарий
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={3}
              placeholder="Комментарий"
              className="min-h-[120px] flex-1 rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSend />
              Отправить
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-5 text-sm text-slate-600">
          Чтобы комментировать рецепты, нужно войти в аккаунт.
        </p>
      )}

      <div className="mt-8 space-y-4">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{comment.user.username}</p>
                <p className="mt-1 text-xs text-slate-500">{formatRole(comment.user.role)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                {comment.viewer.canDelete ? (
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <FiTrash2 />
                    Удалить
                  </button>
                ) : null}
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{comment.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CommentSection;
