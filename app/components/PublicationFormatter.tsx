import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Download, Settings, CheckCircle, AlertCircle } from 'lucide-react';

interface JournalFormat {
  id: string;
  name: string;
  description: string;
  lineSpacing: number;
  wordLimit: number;
  referenceStyle: string;
  fontFamily: string;
  fontSize: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

const DEFAULT_JOURNAL_FORMATS: JournalFormat[] = [
  {
    id: 'ijdr',
    name: 'International Journal of Dental Research (IJDR)',
    description: 'Dental research and clinical studies',
    lineSpacing: 1.5,
    wordLimit: 5000,
    referenceStyle: 'Vancouver',
    fontFamily: 'Times New Roman',
    fontSize: 12,
    margins: { top: 1, bottom: 1, left: 1, right: 1 }
  },
  {
    id: 'jcd',
    name: 'Journal of Clinical Dentistry (JCD)',
    description: 'Clinical dental practice and research',
    lineSpacing: 2.0,
    wordLimit: 4000,
    referenceStyle: 'APA',
    fontFamily: 'Arial',
    fontSize: 11,
    margins: { top: 1.25, bottom: 1.25, left: 1.25, right: 1.25 }
  },
  {
    id: 'joe',
    name: 'Journal of Endodontics (JOE)',
    description: 'Endodontic research and clinical practice',
    lineSpacing: 1.5,
    wordLimit: 6000,
    referenceStyle: 'Chicago',
    fontFamily: 'Garamond',
    fontSize: 12,
    margins: { top: 1, bottom: 1, left: 1.5, right: 1 }
  },
  {
    id: 'custom_modern',
    name: 'Modern Research Journal',
    description: 'Contemporary academic publishing',
    lineSpacing: 1.15,
    wordLimit: 8000,
    referenceStyle: 'Harvard',
    fontFamily: 'Helvetica',
    fontSize: 11,
    margins: { top: 1, bottom: 1, left: 1, right: 1 }
  },
  {
    id: 'custom_classic',
    name: 'Classical Academic Journal',
    description: 'Traditional scholarly publication',
    lineSpacing: 2.0,
    wordLimit: 3000,
    referenceStyle: 'MLA',
    fontFamily: 'Garamond',
    fontSize: 12,
    margins: { top: 1.5, bottom: 1.5, left: 1.5, right: 1.5 }
  }
];

interface FormattedDocument {
  content: string;
  wordCount: number;
  format: JournalFormat;
  originalFileName: string;
}

export function PublicationFormatter() {
  const [manuscriptText, setManuscriptText] = useState<string>('');
  const [journalFormats, setJournalFormats] = useState<JournalFormat[]>(DEFAULT_JOURNAL_FORMATS);
  const [selectedFormat, setSelectedFormat] = useState<JournalFormat>(DEFAULT_JOURNAL_FORMATS[0]);
  const [formattedDocument, setFormattedDocument] = useState<FormattedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomFormat, setShowCustomFormat] = useState(false);
  const [customFormat, setCustomFormat] = useState<Partial<JournalFormat>>({
    name: '',
    description: '',
    lineSpacing: 1.5,
    wordLimit: 5000,
    referenceStyle: 'Vancouver',
    fontFamily: 'Times New Roman',
    fontSize: 12,
    margins: { top: 1, bottom: 1, left: 1, right: 1 }
  });

  const formatDocument = async () => {
    if (!manuscriptText.trim()) {
      setError('Please enter your manuscript text');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Apply actual formatting based on selected journal format
      let formattedText = manuscriptText.trim();
      
      // Apply word limit
      const words = formattedText.split(/\s+/).filter(word => word.length > 0);
      const originalWordCount = words.length;
      
      if (words.length > selectedFormat.wordLimit) {
        formattedText = words.slice(0, selectedFormat.wordLimit).join(' ');
      }

      // Apply journal-specific formatting
      formattedText = applyJournalFormatting(formattedText, selectedFormat);

      const finalWordCount = formattedText.split(/\s+/).filter(word => word.length > 0).length;

      const formattedDoc: FormattedDocument = {
        content: formattedText,
        wordCount: finalWordCount,
        format: selectedFormat,
        originalFileName: 'manuscript.txt'
      };

      setFormattedDocument(formattedDoc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing manuscript. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyJournalFormatting = (text: string, format: JournalFormat): string => {
    let formattedText = text;

    // Apply title formatting first
    formattedText = formatTitles(formattedText, format);

    // Apply reference style formatting
    formattedText = formatReferences(formattedText, format.referenceStyle);

    // Apply section formatting
    formattedText = formatSections(formattedText, format);

    // Apply paragraph formatting
    formattedText = formatParagraphs(formattedText, format);

    // Apply journal-specific formatting
    formattedText = applyJournalSpecificFormatting(formattedText, format);

    return formattedText;
  };

  const applyJournalSpecificFormatting = (text: string, format: JournalFormat): string => {
    let formattedText = text;

    // Add journal header
    const header = `FORMATTED FOR: ${format.name.toUpperCase()}\n`;
    const headerLine = '='.repeat(header.length - 1) + '\n\n';
    
    // Add formatting specifications
    const specs = `FORMATTING SPECIFICATIONS:
- Word Limit: ${format.wordLimit.toLocaleString()} words
- Line Spacing: ${format.lineSpacing}
- Reference Style: ${format.referenceStyle}
- Font: ${format.fontFamily} ${format.fontSize}pt
- Margins: ${format.margins.top}" top, ${format.margins.bottom}" bottom, ${format.margins.left}" left, ${format.margins.right}" right\n\n`;

    formattedText = header + headerLine + specs + formattedText;

    return formattedText;
  };

  const formatReferences = (text: string, referenceStyle: string): string => {
    let formattedText = text;

    if (referenceStyle === 'Vancouver') {
      // Convert numbered references to Vancouver style
      formattedText = formattedText.replace(/\[(\d+)\]/g, '($1)');
      formattedText = formattedText.replace(/\((\d+)\)/g, '($1)');
    } else if (referenceStyle === 'APA') {
      // Convert to APA style (Author, Year)
      formattedText = formattedText.replace(/\[(\d+)\]/g, '[Author, Year]');
      formattedText = formattedText.replace(/\((\d+)\)/g, '(Author, Year)');
    } else if (referenceStyle === 'Chicago') {
      // Convert to Chicago style (Author Year)
      formattedText = formattedText.replace(/\[(\d+)\]/g, '[Author Year]');
      formattedText = formattedText.replace(/\((\d+)\)/g, '(Author Year)');
    } else if (referenceStyle === 'Harvard') {
      // Convert to Harvard style (Author, Year)
      formattedText = formattedText.replace(/\[(\d+)\]/g, '[Author, Year]');
      formattedText = formattedText.replace(/\((\d+)\)/g, '(Author, Year)');
    } else if (referenceStyle === 'MLA') {
      // Convert to MLA style (Author Page)
      formattedText = formattedText.replace(/\[(\d+)\]/g, '[Author Page]');
      formattedText = formattedText.replace(/\((\d+)\)/g, '(Author Page)');
    } else if (referenceStyle === 'IEEE') {
      // Convert to IEEE style [1]
      formattedText = formattedText.replace(/\[(\d+)\]/g, '[$1]');
      formattedText = formattedText.replace(/\((\d+)\)/g, '[$1]');
    } else if (referenceStyle === 'AMA') {
      // Convert to AMA style (superscript)
      formattedText = formattedText.replace(/\[(\d+)\]/g, '^$1^');
      formattedText = formattedText.replace(/\((\d+)\)/g, '^$1^');
    } else if (referenceStyle === 'CSE') {
      // Convert to CSE style (superscript)
      formattedText = formattedText.replace(/\[(\d+)\]/g, '^$1^');
      formattedText = formattedText.replace(/\((\d+)\)/g, '^$1^');
    } else if (referenceStyle === 'ACS') {
      // Convert to ACS style (superscript)
      formattedText = formattedText.replace(/\[(\d+)\]/g, '^$1^');
      formattedText = formattedText.replace(/\((\d+)\)/g, '^$1^');
    } else if (referenceStyle === 'Nature') {
      // Convert to Nature style (superscript)
      formattedText = formattedText.replace(/\[(\d+)\]/g, '^$1^');
      formattedText = formattedText.replace(/\((\d+)\)/g, '^$1^');
    } else if (referenceStyle === 'Science') {
      // Convert to Science style (superscript)
      formattedText = formattedText.replace(/\[(\d+)\]/g, '^$1^');
      formattedText = formattedText.replace(/\((\d+)\)/g, '^$1^');
    }

    return formattedText;
  };

  const formatSections = (text: string, format: JournalFormat): string => {
    let formattedText = text;

    // Add proper section headers with formatting
    const sections = ['Abstract', 'Introduction', 'Methodology', 'Methods', 'Results', 'Discussion', 'Conclusion', 'References'];
    
    sections.forEach(section => {
      const regex = new RegExp(`\\b${section}\\b`, 'gi');
      formattedText = formattedText.replace(regex, `\n\n${section.toUpperCase()}\n`);
    });

    // Add proper spacing between sections
    formattedText = formattedText.replace(/\n{3,}/g, '\n\n');

    return formattedText;
  };

  const formatParagraphs = (text: string, format: JournalFormat): string => {
    let formattedText = text;

    // Ensure proper paragraph spacing
    formattedText = formattedText.replace(/\n{2,}/g, '\n\n');

    // Add proper indentation for paragraphs (except first paragraph of sections)
    const lines = formattedText.split('\n');
    const formattedLines = lines.map((line, index) => {
      if (line.trim() && !line.trim().match(/^[A-Z\s]+$/) && index > 0) {
        // Add indentation for regular paragraphs
        return `    ${line}`;
      }
      return line;
    });

    return formattedLines.join('\n');
  };

  const formatTitles = (text: string, format: JournalFormat): string => {
    let formattedText = text;

    // Format main title
    const lines = formattedText.split('\n');
    if (lines.length > 0 && lines[0].trim()) {
      lines[0] = `TITLE: ${lines[0].toUpperCase()}`;
    }

    // Format section titles
    const sectionTitles = ['ABSTRACT', 'INTRODUCTION', 'METHODOLOGY', 'METHODS', 'RESULTS', 'DISCUSSION', 'CONCLUSION', 'REFERENCES'];
    sectionTitles.forEach(title => {
      const regex = new RegExp(`\\n\\n${title}\\n`, 'gi');
      formattedText = formattedText.replace(regex, `\n\n${title}\n${'='.repeat(title.length)}\n`);
    });

    return formattedText;
  };

  const downloadFormattedDocument = () => {
    if (!formattedDocument) return;

    const blob = new Blob([formattedDocument.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted_${formattedDocument.originalFileName.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const createTestDocument = () => {
    const testContent = `Effectiveness of Novel Dental Treatment Approaches in Clinical Practice

Abstract

This is a sample research manuscript for testing the publication formatter. The document contains various sections including introduction, methodology, results, and conclusion. Recent studies [1,2] have shown promising results in dental treatment outcomes.

Introduction

Dental research has become increasingly important in modern healthcare [3]. This study examines the effectiveness of various dental treatments and their impact on patient outcomes. Previous research [4] has indicated significant variations in treatment success rates.

Methodology

We conducted a randomized controlled trial involving 200 participants [5]. The study was approved by the institutional review board and all participants provided informed consent. Data collection methods followed established protocols [6].

Results

Our findings indicate significant improvements in dental health outcomes. The treatment group showed a 25% improvement compared to the control group [7]. Statistical analysis revealed p < 0.001 significance levels.

Discussion

The results demonstrate clear benefits of the proposed treatment approach [8]. These findings align with previous research [9] and suggest broader applications in clinical practice.

Conclusion

This research demonstrates the effectiveness of the proposed dental treatment approach. Further studies are recommended to validate these findings [10].

References

1. Smith, J. (2023). Modern Dental Research. Journal of Dentistry, 45(2), 123-135.
2. Johnson, A. (2023). Clinical Applications in Dentistry. Dental Science, 12(4), 67-78.
3. Brown, M. (2023). Healthcare Innovations. Medical Research, 33(1), 45-52.
4. Wilson, K. (2023). Treatment Outcomes. Clinical Studies, 18(3), 89-97.
5. Davis, L. (2023). Research Methodology. Scientific Methods, 22(4), 156-164.`;

    setManuscriptText(testContent);
    setFormattedDocument(null);
    setError(null);
  };

  const saveCustomFormat = () => {
    if (!customFormat.name) {
      setError('Please enter a journal name');
      return;
    }

    const newFormat: JournalFormat = {
      id: `custom_${Date.now()}`,
      name: customFormat.name,
      description: customFormat.description || '',
      lineSpacing: customFormat.lineSpacing || 1.5,
      wordLimit: customFormat.wordLimit || 5000,
      referenceStyle: customFormat.referenceStyle || 'Vancouver',
      fontFamily: customFormat.fontFamily || 'Times New Roman',
      fontSize: customFormat.fontSize || 12,
      margins: customFormat.margins || { top: 1, bottom: 1, left: 1, right: 1 }
    };

    setJournalFormats([...journalFormats, newFormat]);
    setSelectedFormat(newFormat);
    setShowCustomFormat(false);
    setError(null);
    
    // Save to localStorage
    const savedFormats = JSON.parse(localStorage.getItem('customFormats') || '[]');
    savedFormats.push(newFormat);
    localStorage.setItem('customFormats', JSON.stringify(savedFormats));
  };

  const resetCustomFormat = () => {
    setCustomFormat({
      name: '',
      description: '',
      lineSpacing: 1.5,
      wordLimit: 5000,
      referenceStyle: 'Vancouver',
      fontFamily: 'Times New Roman',
      fontSize: 12,
      margins: { top: 1, bottom: 1, left: 1, right: 1 }
    });
  };

  // Load custom formats from localStorage on component mount
  useEffect(() => {
    const savedFormats = JSON.parse(localStorage.getItem('customFormats') || '[]');
    if (savedFormats.length > 0) {
      setJournalFormats([...DEFAULT_JOURNAL_FORMATS, ...savedFormats]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-500/8 to-teal-500/8 rounded-full blur-3xl animate-pulse delay-1500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-blue-500/25">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-fade-in">
            Publication Formatter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your manuscript with precision formatting for any journal requirement
          </p>
          <div className="flex justify-center items-center space-x-6 mt-8">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span>Real-time formatting</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300 shadow-lg shadow-blue-400/50"></div>
              <span>Custom journal styles</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600 shadow-lg shadow-purple-400/50"></div>
              <span>Instant download</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload and Settings Section */}
          <div className="space-y-6">
            {/* Manuscript Input */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/25">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Enter Your Manuscript
              </h2>
              
              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    value={manuscriptText}
                    onChange={(e) => {
                      setManuscriptText(e.target.value);
                      setFormattedDocument(null);
                      setError(null);
                    }}
                    placeholder="Paste or type your manuscript here... Start with your title, then add abstract, introduction, methodology, results, and conclusion sections."
                    className="w-full h-72 p-6 border-2 border-gray-600 rounded-xl resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-400"
                    style={{
                      fontFamily: 'Times New Roman, serif',
                      fontSize: '15px',
                      lineHeight: '1.7'
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                      <span className="text-sm font-medium text-gray-300">
                        Words: <span className="text-blue-400 font-bold">{manuscriptText.split(/\s+/).filter(word => word.length > 0).length}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50"></div>
                      <span className="text-sm font-medium text-gray-300">
                        Characters: <span className="text-indigo-400 font-bold">{manuscriptText.length}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                    <span className="text-xs text-gray-400">Ready to format</span>
                  </div>
                </div>
              </div>

              {/* Custom Format Form */}
              {showCustomFormat && (
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 mt-6">
                  <h3 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-purple-500/25">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    Custom Journal Format
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Journal Name *
                      </label>
                      <input
                        type="text"
                        value={customFormat.name || ''}
                        onChange={(e) => setCustomFormat({...customFormat, name: e.target.value})}
                        placeholder="e.g., My Custom Journal"
                        className="w-full p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={customFormat.description || ''}
                        onChange={(e) => setCustomFormat({...customFormat, description: e.target.value})}
                        placeholder="Brief description of the journal"
                        className="w-full p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100 placeholder-gray-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Word Limit
                        </label>
                        <input
                          type="number"
                          value={customFormat.wordLimit || 5000}
                          onChange={(e) => setCustomFormat({...customFormat, wordLimit: parseInt(e.target.value) || 5000})}
                          className="w-full p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Line Spacing
                        </label>
                        <select
                          value={customFormat.lineSpacing || 1.5}
                          onChange={(e) => setCustomFormat({...customFormat, lineSpacing: parseFloat(e.target.value)})}
                          className="w-full p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100"
                        >
                          <option value={1.0}>Single (1.0)</option>
                          <option value={1.15}>1.15</option>
                          <option value={1.5}>1.5</option>
                          <option value={2.0}>Double (2.0)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Reference Style
                        </label>
                        <select
                          value={customFormat.referenceStyle || 'Vancouver'}
                          onChange={(e) => setCustomFormat({...customFormat, referenceStyle: e.target.value})}
                          className="w-full p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100"
                        >
                          <option value="Vancouver">Vancouver</option>
                          <option value="APA">APA</option>
                          <option value="Chicago">Chicago</option>
                          <option value="Harvard">Harvard</option>
                          <option value="MLA">MLA</option>
                          <option value="IEEE">IEEE</option>
                          <option value="AMA">AMA</option>
                          <option value="CSE">CSE</option>
                          <option value="ACS">ACS</option>
                          <option value="Nature">Nature</option>
                          <option value="Science">Science</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Font Size (pt)
                        </label>
                        <input
                          type="number"
                          value={customFormat.fontSize || 12}
                          onChange={(e) => setCustomFormat({...customFormat, fontSize: parseInt(e.target.value) || 12})}
                          min="8"
                          max="16"
                          className="w-full p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Font Family
                      </label>
                      <select
                        value={customFormat.fontFamily || 'Times New Roman'}
                        onChange={(e) => setCustomFormat({...customFormat, fontFamily: e.target.value})}
                        className="w-full p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100"
                      >
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Arial">Arial</option>
                        <option value="Calibri">Calibri</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Garamond">Garamond</option>
                        <option value="Bookman">Bookman</option>
                        <option value="Palatino">Palatino</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Lucida Console">Lucida Console</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Trebuchet MS">Trebuchet MS</option>
                        <option value="Impact">Impact</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                        <option value="Brush Script MT">Brush Script MT</option>
                        <option value="Copperplate">Copperplate</option>
                        <option value="Papyrus">Papyrus</option>
                        <option value="Baskerville">Baskerville</option>
                        <option value="Futura">Futura</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Margins (inches)
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        <input
                          type="number"
                          step="0.25"
                          value={customFormat.margins?.top || 1}
                          onChange={(e) => setCustomFormat({
                            ...customFormat, 
                            margins: {...customFormat.margins!, top: parseFloat(e.target.value) || 1}
                          })}
                          placeholder="Top"
                          className="p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100"
                        />
                        <input
                          type="number"
                          step="0.25"
                          value={customFormat.margins?.bottom || 1}
                          onChange={(e) => setCustomFormat({
                            ...customFormat, 
                            margins: {...customFormat.margins!, bottom: parseFloat(e.target.value) || 1}
                          })}
                          placeholder="Bottom"
                          className="p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100"
                        />
                        <input
                          type="number"
                          step="0.25"
                          value={customFormat.margins?.left || 1}
                          onChange={(e) => setCustomFormat({
                            ...customFormat, 
                            margins: {...customFormat.margins!, left: parseFloat(e.target.value) || 1}
                          })}
                          placeholder="Left"
                          className="p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100"
                        />
                        <input
                          type="number"
                          step="0.25"
                          value={customFormat.margins?.right || 1}
                          onChange={(e) => setCustomFormat({
                            ...customFormat, 
                            margins: {...customFormat.margins!, right: parseFloat(e.target.value) || 1}
                          })}
                          placeholder="Right"
                          className="p-3 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-gray-100"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={saveCustomFormat}
                        disabled={!customFormat.name}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      >
                        Save Custom Format
                      </button>
                      <button
                        onClick={resetCustomFormat}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Journal Format Selection */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-purple-500/25">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                Target Journal Format
              </h2>
              
              <div className="space-y-3">
                {journalFormats.map((format) => (
                  <label
                    key={format.id}
                    className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      selectedFormat.id === format.id
                        ? 'border-blue-500 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 shadow-2xl shadow-blue-500/20'
                        : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="journalFormat"
                      value={format.id}
                      checked={selectedFormat.id === format.id}
                      onChange={() => setSelectedFormat(format)}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-100 text-lg mb-2">{format.name}</h3>
                        <p className="text-sm text-gray-400 mb-3">{format.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-gray-800/60 rounded-lg p-2 border border-gray-600/50">
                            <span className="font-semibold text-blue-400">Word limit:</span>
                            <span className="text-gray-300 ml-1">{format.wordLimit.toLocaleString()}</span>
                          </div>
                          <div className="bg-gray-800/60 rounded-lg p-2 border border-gray-600/50">
                            <span className="font-semibold text-indigo-400">Line spacing:</span>
                            <span className="text-gray-300 ml-1">{format.lineSpacing}</span>
                          </div>
                          <div className="bg-gray-800/60 rounded-lg p-2 border border-gray-600/50">
                            <span className="font-semibold text-purple-400">Reference:</span>
                            <span className="text-gray-300 ml-1">{format.referenceStyle}</span>
                          </div>
                          <div className="bg-gray-800/60 rounded-lg p-2 border border-gray-600/50">
                            <span className="font-semibold text-emerald-400">Font:</span>
                            <span className="text-gray-300 ml-1">{format.fontFamily} {format.fontSize}pt</span>
                          </div>
                        </div>
                      </div>
                      {selectedFormat.id === format.id && (
                        <div className="ml-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
                
                {/* Custom Format Button */}
                <button
                  onClick={() => setShowCustomFormat(!showCustomFormat)}
                  className="w-full p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-400 hover:bg-blue-900/20 transition-all duration-300 text-center transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-purple-500/25">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-300 text-lg">
                      {showCustomFormat ? 'Hide Custom Format' : 'Create Custom Format'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={formatDocument}
                disabled={!manuscriptText.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    Format Document
                  </div>
                )}
              </button>

              <button
                onClick={createTestDocument}
                className="w-full bg-gradient-to-r from-gray-500 to-slate-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-600 hover:to-slate-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                  Load Sample Manuscript
                </div>
              </button>
            </div>

            {error && (
              <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border-2 border-red-700/50 rounded-xl p-6 transform animate-pulse">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-red-500/25">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-300 mb-1">Error</h4>
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-emerald-500/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Formatted Document
            </h2>
            
            {formattedDocument ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-xl p-6 border border-emerald-700/50">
                  <h3 className="font-bold text-gray-100 mb-4 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-emerald-500/25">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    Format Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-600/50">
                      <span className="font-semibold text-emerald-400">Target Journal:</span>
                      <p className="text-gray-300 mt-1">{formattedDocument.format.name}</p>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-600/50">
                      <span className="font-semibold text-blue-400">Word Count:</span>
                      <p className="text-gray-300 mt-1">{formattedDocument.wordCount.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-600/50">
                      <span className="font-semibold text-purple-400">Reference Style:</span>
                      <p className="text-gray-300 mt-1">{formattedDocument.format.referenceStyle}</p>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-600/50">
                      <span className="font-semibold text-indigo-400">Line Spacing:</span>
                      <p className="text-gray-300 mt-1">{formattedDocument.format.lineSpacing}</p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-600 rounded-xl p-6 max-h-96 overflow-y-auto bg-gray-800/50 backdrop-blur-sm">
                  <h3 className="font-bold text-gray-100 mb-4 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-500/25">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    Preview
                  </h3>
                  <div 
                    className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed"
                    style={{
                      fontFamily: formattedDocument.format.fontFamily,
                      fontSize: `${formattedDocument.format.fontSize}px`,
                      lineHeight: formattedDocument.format.lineSpacing,
                    }}
                  >
                    {formattedDocument.content}
                  </div>
                </div>

                <button
                  onClick={downloadFormattedDocument}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  Download Formatted Document
                </button>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-gray-600/50">
                  <FileText className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Document Formatted Yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Enter your manuscript and select a journal format to see the beautifully formatted result
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 