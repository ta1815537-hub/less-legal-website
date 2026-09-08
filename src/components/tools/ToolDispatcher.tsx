import React from 'react';
import { ToolDefinition } from '../../types';
import { ToolShell } from './ToolShell';
import { PdfToolsView } from './implementations/PdfToolsView';
import { ImageToolsView } from './implementations/ImageToolsView';
import { TextToolsView } from './implementations/TextToolsView';
import { CalculatorToolsView } from './implementations/CalculatorToolsView';
import { QrDigitalToolsView } from './implementations/QrDigitalToolsView';
import { ProductivityToolsView } from './implementations/ProductivityToolsView';

import { getToolBySlug } from '../../tools/toolRegistry';

interface ToolDispatcherProps {
  tool: ToolDefinition;
  onBackToDirectory: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const ToolDispatcher: React.FC<ToolDispatcherProps> = ({
  tool,
  onBackToDirectory,
  onSelectTool,
}) => {
  const handleSelectRelated = (slug: string) => {
    const relatedTool = getToolBySlug(slug);
    if (relatedTool) {
      onSelectTool(relatedTool);
    }
  };

  const renderToolImplementation = () => {
    switch (tool.category) {
      case 'pdf':
        return <PdfToolsView tool={tool} />;
      case 'image':
        return <ImageToolsView tool={tool} />;
      case 'text':
        return <TextToolsView tool={tool} />;
      case 'calculators':
        return <CalculatorToolsView tool={tool} />;
      case 'qr-digital':
        return <QrDigitalToolsView tool={tool} />;
      case 'productivity':
        return <ProductivityToolsView tool={tool} />;

      default:
        return (
          <div className="p-8 text-center text-slate-500">
            Tool implementation loading...
          </div>
        );
    }
  };

  return (
    <ToolShell
      tool={tool}
      onBack={onBackToDirectory}
      onSelectRelated={handleSelectRelated}
    >
      {renderToolImplementation()}
    </ToolShell>
  );
};
