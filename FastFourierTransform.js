/**
 * Fast Fourier Transform (Cooley-Tukey Algorithm)
 * Time Complexity: O(n log n)
 */
class FFT {
  static transform(input) {
    const N = input.length;
    
    // Base case
    if (N === 1) return input;
    
    // Verify input is power of two
    if ((N & (N - 1)) !== 0) {
      throw new Error('Input size must be a power of two');
    }

    // Split even and odd indices
    const even = new Array(N/2);
    const odd = new Array(N/2);
    for (let i = 0; i < N/2; i++) {
      even[i] = input[2*i];
      odd[i] = input[2*i + 1];
    }

    // Recursive calls
    const evenTransformed = FFT.transform(even);
    const oddTransformed = FFT.transform(odd);

    // Combine results
    const output = new Array(N);
    for (let k = 0; k < N/2; k++) {
      const angle = -2 * Math.PI * k / N;
      const twiddle = new Complex(Math.cos(angle), Math.sin(angle));
      
      const term = oddTransformed[k].multiply(twiddle);
      output[k] = evenTransformed[k].add(term);
      output[k + N/2] = evenTransformed[k].subtract(term);
    }

    return output;
  }

  static inverseTransform(input) {
    const N = input.length;
    const conjugate = input.map(c => c.conjugate());
    const transformed = FFT.transform(conjugate);
    return transformed.map(c => c.conjugate().divide(N));
  }
}

/**
 * Complex Number Implementation
 */
class Complex {
  constructor(real, imaginary = 0) {
    this.re = real;
    this.im = imaginary;
  }

  add(other) {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  subtract(other) {
    return new Complex(this.re - other.re, this.im - other.im);
  }

  multiply(other) {
    return new Complex(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }

  divide(scalar) {
    return new Complex(this.re / scalar, this.im / scalar);
  }

  conjugate() {
    return new Complex(this.re, -this.im);
  }

  magnitude() {
    return Math.sqrt(this.re ** 2 + this.im ** 2);
  }
}

/**
 * Example Usage: Audio Frequency Analysis
 */
function analyzeFrequency(signal) {
  // Convert signal to complex numbers
  const complexSignal = signal.map(s => new Complex(s));
  
  // Perform FFT
  const spectrum = FFT.transform(complexSignal);
  
  // Calculate magnitudes
  return spectrum.map(c => c.magnitude());
}

// Test signal (8 samples of a 2Hz wave sampled at 8Hz)
const sampleRate = 8;
const testSignal = [0, 0.707, 1, 0.707, 0, -0.707, -1, -0.707];

// Perform frequency analysis
const magnitudes = analyzeFrequency(testSignal);
console.log('Frequency Magnitudes:', magnitudes);
