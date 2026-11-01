import React from 'react';
import { CheckCircle2, FileEdit, Clock, AlertCircle, Archive } from 'lucide-react';

export default function StatusBadge({ status }) {
  switch (status) {
    case 'published':
      return (
        <span className="badge badge-published">
          <CheckCircle2 size={13} />
          Published
        </span>
      );
    case 'pending_review':
      return (
        <span className="badge badge-pending">
          <Clock size={13} />
          In Review
        </span>
      );
    case 'rejected':
      return (
        <span className="badge badge-rejected">
          <AlertCircle size={13} />
          Correction Needed
        </span>
      );
    case 'archived':
      return (
        <span className="badge badge-draft">
          <Archive size={13} />
          Archived
        </span>
      );
    case 'draft':
    default:
      return (
        <span className="badge badge-draft">
          <FileEdit size={13} />
          Draft
        </span>
      );
  }
}
