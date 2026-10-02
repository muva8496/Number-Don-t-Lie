import React from 'react';
import { SourceInspectorModal } from '../SourceInspectorModal';
import { WritingStudio } from '../studio/WritingStudio';
import { exportStudioZip } from '../../lib/studioStorage';

interface AuthorToolsProps {
  isInspectorOpen: boolean;
  onCloseInspector: () => void;
  isStudioOpen: boolean;
  onCloseStudio: () => void;
  onRefreshPublicData?: () => void;
}

/**
 * Handles all author-only operations: Writing Studio, Source Inspector, and ZIP Exports.
 * This entire module and its dependencies (IndexedDB studio, Markdown parser, JSZip)
 * are lazy-loaded exclusively when isAuthorMode is true.
 */
export const AuthorTools: React.FC<AuthorToolsProps> = ({
  isInspectorOpen,
  onCloseInspector,
  isStudioOpen,
  onCloseStudio,
  onRefreshPublicData
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await exportStudioZip();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ndl-numbers-dont-lie-jekyll.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create author ZIP export:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {isStudioOpen && (
        <WritingStudio
          onClose={onCloseStudio}
          onRefreshPublicData={onRefreshPublicData}
        />
      )}

      {isInspectorOpen && (
        <SourceInspectorModal
          isOpen={isInspectorOpen}
          onClose={onCloseInspector}
          onDownloadZip={handleDownloadZip}
          isDownloadingZip={isDownloading}
        />
      )}
    </>
  );
};

export default AuthorTools;
