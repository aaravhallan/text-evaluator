import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Lightbulb, FileText, Loader2, Upload } from 'lucide-react';

export default function TextEvaluator() {
  const [text, setText] = useState('');
  const [docType, setDocType] = useState('academic-essay');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [aiDetectionResults, setAiDetectionResults] = useState(null);
  const [runningDetection, setRunningDetection] = useState(false);

  const docTypes = {
    'academic-essay': 'Academic Essay',
    'university-essay': 'University Application Essay',
    'university-resume': 'University Application Resume',
    'cover': 'Cover Letter',
    'cv': 'CV',
    'resume': 'Job Resume'
  };

  const isResumeType = ['university-resume', 'cv', 'resume'].includes(docType);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setUploadedFile(file);
    setError('');
    setText('');
  };

  const analyzeText = async () => {
    if (!text.trim() && !uploadedFile) {
      setError('Please enter text or upload a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    let systemPrompt = '';
    
    if (docType === 'academic-essay') {
      systemPrompt = `You are an expert evaluator analyzing an ACADEMIC ESSAY (for coursework, research papers, or academic submissions).

Your task is to provide a structured analysis with these sections:

1. ✅ STRENGTHS: List 3-5 specific things that work well
2. ⚠️ DETECTED ISSUES: Grammar, spelling, citation issues, awkward phrasing, unclear arguments, structural problems, weak thesis statements
3. 🚫 AI/FLAG RISK: Identify phrases or patterns that may trigger:
   - AI detection systems (Turnitin AI detection, GPT detectors)
   - Plagiarism filters
   - Generic academic language that sounds templated
   - Overly formal or robotic prose
   - Lack of original analysis or critical thinking
   For each risk, explain WHY it's problematic and what it signals to detection systems

4. 💡 FIX SUGGESTIONS: Concrete, actionable improvements with before/after examples

Focus on:
- Original analysis vs. regurgitated information
- Specific evidence vs. vague generalizations
- Natural academic voice vs. AI-generated formal prose
- Critical thinking and argumentation
- Proper citation and scholarly tone`;

    } else if (docType === 'university-essay') {
      systemPrompt = `You are an expert evaluator analyzing a UNIVERSITY APPLICATION ESSAY (personal statement, supplemental essay, or admissions essay).

Your task is to provide a structured analysis with these sections:

1. ✅ STRENGTHS: List 3-5 specific things that work well
2. ⚠️ DETECTED ISSUES: Grammar, clichés, lack of specificity, weak storytelling, unclear personal voice
3. 🚫 AI/FLAG RISK & AUTO-REJECTION TRIGGERS: Identify content that may cause automatic rejection:
   - Generic phrases used in thousands of applications ("ever since I was young", "I've always been passionate about", "this experience taught me")
   - AI-generated patterns that admissions AI filters detect
   - Overly polished prose that lacks authentic teenage/young adult voice
   - Essays that could apply to any applicant (no personal details)
   - Red flag phrases that trigger plagiarism or AI detection
   - Lack of specific anecdotes, names, places, or personal details
   
   **CRITICAL**: For each flagged item, explain:
   - Why it triggers auto-rejection algorithms
   - What the university's AI screening system is looking for
   - How admissions officers would interpret this content
   
4. 💡 FIX SUGGESTIONS: Concrete improvements to make the essay sound authentic, personal, and human. Include specific examples of how to add personal details.

Focus on:
- Unique personal stories vs. generic experiences
- Specific details (names, places, moments) vs. vague statements
- Authentic teenage/young adult voice vs. overly formal or AI-polished prose
- Showing vs. telling
- Vulnerability and genuine reflection`;

    } else if (docType === 'university-resume') {
      systemPrompt = `You are an expert evaluator analyzing a UNIVERSITY APPLICATION RESUME (for college admissions, scholarships, or undergraduate applications).

Your task is to provide a structured analysis covering BOTH content AND design:

1. ✅ STRENGTHS: What works well in content and presentation
2. ⚠️ DETECTED ISSUES: Content problems, formatting issues, missing information, unclear descriptions
3. 🚫 AI/FLAG RISK & AUTO-REJECTION TRIGGERS: Identify issues that cause automatic rejection:
   
   **CONTENT FLAGS:**
   - Generic activity descriptions without specific achievements
   - Inflated or exaggerated claims
   - Buzzwords without substance ("leadership", "teamwork" without examples)
   - Missing key information (dates, hours, impact metrics)
   - Activities that sound fabricated or AI-generated
   
   **DESIGN/FORMAT FLAGS THAT CAUSE AUTO-REJECTION:**
   - Non-ATS-friendly fonts (decorative, script, or unusual fonts)
   - Multiple columns that confuse scanning systems
   - Tables, text boxes, or graphics that scanners can't read
   - Headers/footers that get lost in parsing
   - Inconsistent formatting or spacing
   - Colors that don't scan well or look unprofessional
   - Photos or images (not standard for US applications)
   - Unconventional section names AI can't categorize
   - File formatting issues (incorrect PDF encoding)
   
   **CRITICAL**: Explain what the university's AI screening system looks for and how design choices affect automated scoring.
   
4. 💡 FIX SUGGESTIONS: Specific improvements for both content and design/formatting

If a PDF was uploaded, analyze its visual design, layout, formatting, and ATS-compatibility in detail.`;

    } else if (docType === 'resume') {
      systemPrompt = `You are an expert evaluator analyzing a JOB RESUME for corporate/professional applications.

Your task is to provide a structured analysis covering BOTH content AND design:

1. ✅ STRENGTHS: What works well
2. ⚠️ DETECTED ISSUES: Content and formatting problems
3. 🚫 AI/FLAG RISK & ATS AUTO-REJECTION TRIGGERS:
   
   **CONTENT FLAGS:**
   - Missing keywords for ATS systems
   - Generic descriptions without quantified achievements
   - Employment gaps without explanation
   - Overused buzzwords without substance
   
   **DESIGN/FORMAT FLAGS THAT CAUSE AUTO-REJECTION:**
   - Non-ATS-compatible fonts (decorative, script fonts)
   - Multiple columns that confuse ATS parsers
   - Tables, text boxes, images, or graphics
   - Headers/footers with critical information
   - Unusual section headings ATS can't parse
   - Colors that reduce scannability
   - Icons or visual elements that break parsing
   - Wrong file format or encoding issues
   
   Explain specifically what ATS systems look for and how design affects automated scoring.
   
4. 💡 FIX SUGGESTIONS: Actionable improvements for content and ATS-friendly design

If a PDF was uploaded, provide detailed analysis of visual design and ATS compatibility.`;

    } else if (docType === 'cv') {
      systemPrompt = `You are an expert evaluator analyzing a CV (Curriculum Vitae) for academic or research positions.

Your task is to provide a structured analysis:

1. ✅ STRENGTHS: What works well
2. ⚠️ DETECTED ISSUES: Content gaps, formatting problems, unclear descriptions
3. 🚫 AI/FLAG RISK & AUTO-REJECTION TRIGGERS:
   
   **CONTENT FLAGS:**
   - Missing publications, research, or academic achievements
   - Vague research descriptions
   - Unexplained career gaps
   - Generic teaching or research statements
   
   **DESIGN/FORMAT FLAGS:**
   - Inconsistent formatting across sections
   - Poor hierarchy and readability
   - Missing standard CV sections
   - Unprofessional fonts or spacing
   - Design elements that look amateurish
   
   For academic systems that scan CVs, explain what triggers rejection.
   
4. 💡 FIX SUGGESTIONS: Improvements for academic positioning and formatting

If a PDF was uploaded, analyze the visual presentation and academic professionalism.`;

    } else if (docType === 'cover') {
      systemPrompt = `You are an expert evaluator analyzing a COVER LETTER for job applications.

Your task is to provide a structured analysis:

1. ✅ STRENGTHS: What works well
2. ⚠️ DETECTED ISSUES: Grammar, weak opening, generic content, poor structure
3. 🚫 AI/FLAG RISK: Identify phrases that trigger:
   - AI detection (overly formal, templated language)
   - Generic phrases used in thousands of letters
   - Lack of company-specific research
   - Missing personal voice or enthusiasm
   - Buzzwords without backing evidence
   
   Explain why these trigger rejection and how hiring managers interpret them.
   
4. 💡 FIX SUGGESTIONS: Concrete improvements with examples

Focus on authentic voice, company-specific details, and genuine enthusiasm.`;
    }

    try {
      let messageContent;

      if (uploadedFile) {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(uploadedFile);
        });

        messageContent = [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64Data
            }
          },
          {
            type: 'text',
            text: `${systemPrompt}\n\nAnalyze this ${docTypes[docType]}. Pay special attention to design, formatting, layout, fonts, colors, spacing, and ATS compatibility. Describe what you see visually and explain how these design choices affect automated screening systems.`
          }
        ];

        // Extract text for later use
        const extractResponse = await fetch('/api/claude', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'document',
                    source: {
                      type: 'base64',
                      media_type: 'application/pdf',
                      data: base64Data
                    }
                  },
                  {
                    type: 'text',
                    text: 'Extract all the text content from this document. Return only the text, no analysis or commentary.'
                  }
                ]
              }
            ]
          })
        });

        const extractData = await extractResponse.json();
        if (extractData.content && extractData.content[0]) {
          // Store for potential AI detection later
        }
      } else {
        messageContent = `${systemPrompt}\n\nAnalyze this ${docTypes[docType]}:\n\n${text}`;
      }

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: messageContent
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setError(`API Error: ${data.error.message || 'Invalid API key or request failed'}`);
        return;
      }
      
      if (data.content && data.content[0]) {
        setAnalysis(data.content[0].text);
      } else {
        setError('Failed to get analysis. Please try again.');
      }
    } catch (err) {
      setError('Error analyzing: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const runAIDetection = async () => {
    if (!text.trim() && !uploadedFile) {
      setError('Please enter text to check for AI detection');
      return;
    }

    setRunningDetection(true);
    setError('');
    setAiDetectionResults(null);

    try {
      let contentToCheck = text;

      if (uploadedFile) {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(uploadedFile);
        });

        const extractResponse = await fetch('/api/claude', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'document',
                    source: {
                      type: 'base64',
                      media_type: 'application/pdf',
                      data: base64Data
                    }
                  },
                  {
                    type: 'text',
                    text: 'Extract all the text content from this document. Return only the text, no analysis or commentary.'
                  }
                ]
              }
            ]
          })
        });

        const extractData = await extractResponse.json();
        if (extractData.content && extractData.content[0]) {
          contentToCheck = extractData.content[0].text;
        }
      }

      const detectionPrompt = `You are an AI detection expert. Analyze this text and provide a detailed assessment of whether it was likely written by AI.

CRITICAL: You must respond with ONLY a valid JSON object, no markdown formatting, no backticks, no preamble. Just pure JSON.

Analyze these specific aspects:

1. **Perplexity Score (0-100)**: How predictable is the text? Lower = more AI-like
2. **Burstiness Score (0-100)**: Variation in sentence structure? Lower = more AI-like  
3. **AI Probability (0-100)**: Overall likelihood this is AI-generated
4. **Specific AI Patterns Found**: List concrete examples from the text
5. **Human Indicators**: What suggests human authorship
6. **Verdict**: "Likely AI", "Possibly AI", "Likely Human", or "Definitely Human"

Respond with this exact JSON structure:
{
  "perplexity_score": <number 0-100>,
  "burstiness_score": <number 0-100>,
  "ai_probability": <number 0-100>,
  "ai_patterns": ["pattern 1", "pattern 2", ...],
  "human_indicators": ["indicator 1", "indicator 2", ...],
  "verdict": "<verdict>",
  "explanation": "<2-3 sentence explanation>",
  "detector_name": "Claude AI Analysis"
}

Text to analyze:

${contentToCheck}`;

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: detectionPrompt
            }
          ]
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(`API Error: ${data.error.message || 'Detection failed'}`);
        return;
      }

      if (data.content && data.content[0]) {
        const responseText = data.content[0].text;
        const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        try {
          const detectionResult = JSON.parse(cleanedText);
          setAiDetectionResults([detectionResult]);
        } catch (parseError) {
          setError('Failed to parse AI detection results. Please try again.');
          console.error('Parse error:', parseError, 'Response:', cleanedText);
        }
      }
    } catch (err) {
      setError('Error running AI detection: ' + err.message);
      console.error('Detection error:', err);
    } finally {
      setRunningDetection(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-green-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getVerdictColor = (verdict) => {
    if (verdict.includes('Human')) return 'text-green-700 bg-green-100';
    if (verdict.includes('Possibly')) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const formatAnalysis = (text) => {
    if (!text) return null;

    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    let currentContent = [];

    lines.forEach((line) => {
      if (line.includes('✅') || line.includes('STRENGTHS')) {
        if (currentSection) {
          sections.push({ type: currentSection, content: currentContent.join('\n') });
        }
        currentSection = 'strengths';
        currentContent = [];
      } else if (line.includes('⚠️') || line.includes('DETECTED ISSUES')) {
        if (currentSection) {
          sections.push({ type: currentSection, content: currentContent.join('\n') });
        }
        currentSection = 'issues';
        currentContent = [];
      } else if (line.includes('🚫') || line.includes('AI/FLAG RISK') || line.includes('AUTO-REJECTION')) {
        if (currentSection) {
          sections.push({ type: currentSection, content: currentContent.join('\n') });
        }
        currentSection = 'risks';
        currentContent = [];
      } else if (line.includes('💡') || line.includes('FIX SUGGESTIONS')) {
        if (currentSection) {
          sections.push({ type: currentSection, content: currentContent.join('\n') });
        }
        currentSection = 'fixes';
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    });

    if (currentSection) {
      sections.push({ type: currentSection, content: currentContent.join('\n') });
    }

    return sections;
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-bold text-gray-900">{boldText}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case 'strengths': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'issues': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'risks': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'fixes': return <Lightbulb className="w-5 h-5 text-blue-600" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getSectionTitle = (type) => {
    switch (type) {
      case 'strengths': return '✅ Strengths';
      case 'issues': return '⚠️ Detected Issues';
      case 'risks': return '🚫 AI/Flag Risk & Auto-Rejection Triggers';
      case 'fixes': return '💡 Fix Suggestions';
      default: return 'Analysis';
    }
  };

  const getSectionBg = (type) => {
    switch (type) {
      case 'strengths': return 'bg-green-50 border-green-200';
      case 'issues': return 'bg-yellow-50 border-yellow-200';
      case 'risks': return 'bg-red-50 border-red-200';
      case 'fixes': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const sections = analysis ? formatAnalysis(analysis) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Application Text Evaluator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expert analysis for university applications, job submissions, and academic essays. 
            Detect AI flags, design issues, and avoid auto-rejections.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Document Type
          </label>
          <select
            value={docType}
            onChange={(e) => {
              setDocType(e.target.value);
              setUploadedFile(null);
              setText('');
              setAnalysis(null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="academic-essay">Academic Essay</option>
            <option value="university-essay">University Application Essay</option>
            <option value="university-resume">University Application Resume (PDF supported)</option>
            <option value="cover">Cover Letter</option>
            <option value="cv">CV (PDF supported)</option>
            <option value="resume">Job Resume (PDF supported)</option>
          </select>

          {isResumeType && (
            <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Upload className="w-5 h-5 text-indigo-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    Upload PDF for Design Analysis
                  </h3>
                  <p className="text-sm text-indigo-700 mb-3">
                    Upload your PDF to get detailed feedback on formatting, layout, fonts, colors, and ATS compatibility.
                  </p>
                  <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose PDF File
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadedFile && (
                    <div className="mt-2 text-sm text-indigo-700">
                      ✓ Uploaded: {uploadedFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!uploadedFile && (
            <>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Paste your ${docTypes[docType].toLowerCase()} here...`}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
              />
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">
                  {text.length} characters • {text.split(/\s+/).filter(w => w).length} words
                </span>
              </div>
            </>
          )}

          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={analyzeText}
              disabled={loading || (!text.trim() && !uploadedFile)}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Text'
              )}
            </button>
            
            <button
              onClick={runAIDetection}
              disabled={runningDetection || (!text.trim() && !uploadedFile)}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {runningDetection ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Detecting AI...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  AI Detection Check
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {aiDetectionResults && (
          <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                AI Detection Results
              </h2>
            </div>

            {aiDetectionResults.map((result, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {result.detector_name}
                  </h3>
                  <span className={`px-4 py-2 rounded-full font-bold text-sm ${getVerdictColor(result.verdict)}`}>
                    {result.verdict}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">AI Probability</div>
                    <div className={`text-3xl font-bold ${getScoreColor(100 - result.ai_probability)}`}>
                      {result.ai_probability}%
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreBg(100 - result.ai_probability)}`}
                        style={{ width: `${result.ai_probability}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Perplexity Score</div>
                    <div className={`text-3xl font-bold ${getScoreColor(result.perplexity_score)}`}>
                      {result.perplexity_score}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Higher = More Human-like</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Burstiness Score</div>
                    <div className={`text-3xl font-bold ${getScoreColor(result.burstiness_score)}`}>
                      {result.burstiness_score}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Higher = More Varied Writing</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Analysis Explanation</h4>
                  <p className="text-blue-800 text-sm">{result.explanation}</p>
                </div>

                {result.ai_patterns && result.ai_patterns.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      AI Patterns Detected
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {result.ai_patterns.map((pattern, i) => (
<li key={i} className="text-red-800 text-sm">{pattern}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.human_indicators && result.human_indicators.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Human Writing Indicators
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {result.human_indicators.map((indicator, i) => (
                        <li key={i} className="text-green-800 text-sm">{indicator}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> AI detection is not 100% accurate. These results should be used as guidance, not definitive proof. 
                Human-written text can sometimes be flagged as AI, and AI text can sometimes appear human-like.
              </p>
            </div>
          </div>
        )}

        {sections && (
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 ${getSectionBg(section.type)}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {getSectionIcon(section.type)}
                  <h2 className="text-xl font-bold text-gray-900">
                    {getSectionTitle(section.type)}
                  </h2>
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {section.content.split('\n').map((line, lineIdx) => (
                    <div key={lineIdx} className="mb-2">
                      {renderFormattedText(line)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!analysis && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {isResumeType 
                ? 'Upload a PDF or paste text above and click "Analyze Text" to get started'
                : 'Paste your text above and click "Analyze Text" to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}