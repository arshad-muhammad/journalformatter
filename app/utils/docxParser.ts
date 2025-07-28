export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Check if it's a valid DOCX file (should start with PK signature)
    if (uint8Array[0] !== 0x50 || uint8Array[1] !== 0x4B) {
      throw new Error('Invalid DOCX file format');
    }
    
    // Convert to string and extract text content
    const decoder = new TextDecoder('utf-8');
    const content = decoder.decode(uint8Array);
    
    // Look for text content in DOCX XML structure
    const textMatches = content.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
    
    if (textMatches && textMatches.length > 0) {
      const extractedText = textMatches
        .map(match => {
          // Extract text content from <w:t> tags
          const textContent = match.replace(/<w:t[^>]*>([^<]*)<\/w:t>/, '$1');
          return textContent;
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (extractedText.length > 0) {
        return extractedText;
      }
    }
    
    // Try alternative XML patterns
    const altTextMatches = content.match(/<t[^>]*>([^<]*)<\/t>/g);
    if (altTextMatches && altTextMatches.length > 0) {
      const extractedText = altTextMatches
        .map(match => {
          const textContent = match.replace(/<t[^>]*>([^<]*)<\/t>/, '$1');
          return textContent;
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (extractedText.length > 0) {
        return extractedText;
      }
    }
    
    // Alternative approach: look for any readable text patterns
    const readablePatterns = [
      /[A-Za-z]{3,}/g,  // Words with 3+ letters
      /[0-9]+/g,        // Numbers
      /[.!?]+/g         // Punctuation
    ];
    
    let readableText = '';
    for (const pattern of readablePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        readableText += matches.join(' ') + ' ';
      }
    }
    
    readableText = readableText.replace(/\s+/g, ' ').trim();
    
    if (readableText.length > 50) {
      return readableText;
    }
    
    throw new Error('No readable text content found in DOCX file');
    
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to extract text from DOCX file. Please try converting to .txt format first.');
  }
}

export function extractTextFromTxt(file: File): Promise<string> {
  return file.text();
}

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'text/plain') {
    return extractTextFromTxt(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return extractTextFromDocx(file);
  } else {
    throw new Error('Unsupported file type. Please use .docx or .txt files.');
  }
} 