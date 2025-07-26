
import React, { useState } from 'react';
import { ScriptData } from '../types';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Edit3, Check, RefreshCw, Film, Hash, MessageSquare, List } from './icons';
import { Spinner } from './ui/Spinner';

interface ScriptEditorStepProps {
  scriptData: ScriptData;
  onAccept: (updatedScriptData: ScriptData) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const ScriptEditorStep: React.FC<ScriptEditorStepProps> = ({ scriptData, onAccept, onRegenerate, isRegenerating }) => {
  const [editableData, setEditableData] = useState<ScriptData>(scriptData);

  const handleInputChange = (field: keyof ScriptData, value: string | string[]) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleScriptChange = (field: keyof ScriptData['script'], value: string) => {
    setEditableData(prev => ({
        ...prev,
        script: {
            ...prev.script,
            [field]: value,
        }
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center text-white">Review & Refine Your Script</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Script */}
        <div className="flex flex-col gap-4">
          <Card>
            <h3 className="font-semibold text-lg mb-3 flex items-center text-cyan-300"><MessageSquare className="mr-2"/> Script</h3>
            <div className="space-y-4">
              <div>
                <label className="font-bold text-gray-300">Hook</label>
                <Textarea value={editableData.script.hook} onChange={e => handleScriptChange('hook', e.target.value)} rows={2} />
              </div>
              <div>
                <label className="font-bold text-gray-300">Body</label>
                <Textarea value={editableData.script.body} onChange={e => handleScriptChange('body', e.target.value)} rows={6} />
              </div>
              <div>
                <label className="font-bold text-gray-300">Call to Action</label>
                <Textarea value={editableData.script.cta} onChange={e => handleScriptChange('cta', e.target.value)} rows={2} />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Metadata */}
        <div className="flex flex-col gap-4">
          <Card>
            <h3 className="font-semibold text-lg mb-3 flex items-center text-cyan-300"><Edit3 className="mr-2"/> Video Details</h3>
            <div className="space-y-4">
              <div>
                <label className="font-bold text-gray-300">Title</label>
                <Input value={editableData.title} onChange={e => handleInputChange('title', e.target.value)} />
              </div>
              <div>
                <label className="font-bold text-gray-300">Description</label>
                <Textarea value={editableData.description} onChange={e => handleInputChange('description', e.target.value)} rows={3} />
              </div>
              <div>
                 <label className="font-bold text-gray-300 flex items-center"><Hash className="mr-2 w-4 h-4"/> Hashtags</label>
                <Input value={editableData.hashtags.join(', ')} onChange={e => handleInputChange('hashtags', e.target.value.split(',').map(h => h.trim()))} />
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold text-lg mb-3 flex items-center text-cyan-300"><Film className="mr-2"/> B-Roll Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {editableData.bRollKeywords.map((keyword, index) => (
                <span key={index} className="bg-gray-600 text-gray-200 px-3 py-1 text-sm rounded-full">{keyword}</span>
              ))}
            </div>
          </Card>
           <Card>
            <h3 className="font-semibold text-lg mb-3 flex items-center text-cyan-300"><List className="mr-2"/> Captions</h3>
            <div className="max-h-32 overflow-y-auto pr-2">
                <ul className="list-disc list-inside text-gray-300">
                    {editableData.captions.map((caption, index) => (
                        <li key={index}>{caption}</li>
                    ))}
                </ul>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button onClick={onRegenerate} variant="secondary" disabled={isRegenerating}>
          {isRegenerating ? <Spinner className="mr-2" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Regenerate
        </Button>
        <Button onClick={() => onAccept(editableData)}>
          <Check className="mr-2 h-4 w-4" />
          Accept & Create Video
        </Button>
      </div>
    </div>
  );
};

export default ScriptEditorStep;
