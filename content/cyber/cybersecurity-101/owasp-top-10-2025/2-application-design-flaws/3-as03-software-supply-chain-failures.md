## Software Supply Chain Failures

**What It Is**  
Software supply chain failures happen when applications rely on components, libraries, services, or models that are compromised, outdated, or improperly verified. These weaknesses are not inherent in your code, but rather in the software and tools you depend on. Attackers exploit these weak links to inject malicious code, bypass security, or steal sensitive data.

**Why It Matters**  
Modern applications are built from many third-party packages, APIs, and AI models. One compromised dependency can compromise your entire system, allowing attackers to gain access without ever touching your own code. Supply chain attacks can be automated and distributed, making them hard to detect and very damaging.

**Example**  
In 2021, the [SolarWinds](https://www.fortinet.com/uk/resources/cyberglossary/solarwinds-cyber-attack) Orion compromise showed the danger of supply chain attacks. Attackers inserted malicious code into a trusted update, affecting thousands of organisations that automatically installed it. This wasn’t a bug in SolarWinds’ core logic. It was a flaw in the software update building, verification, and distribution process.

With AI, we can observe this when using unverified third-party models or fine-tuned datasets that can embed hidden behaviours, backdoors, or biased outputs, compromising systems or leaking data.

**Common Patterns**

- Using unverified or unmaintained libraries and dependencies
- Automatically installing updates without verification
- Over-reliance on third-party AI models without monitoring or auditing
- Insecure build pipelines or CI/CD processes that allow tampering
- Poor license or provenance tracking for components
- Lack of monitoring for vulnerabilities in dependencies after deployment

**How To Protect The Supply Chain**

- Verify all third-party components, libraries, and AI models before use
- Monitor and patch dependencies regularly
- Sign, verify, and audit software updates and packages
- Lock down CI/CD pipelines and build processes to prevent tampering
- Track provenance and licensing for all dependencies
- Implement runtime monitoring for unusual behaviour from dependencies or AI components
- Integrate supply chain threat modelling into the SDLC, including testing, deployment, and update workflows

## Challenge
##### Navigate to `10.49.170.253:5003`. The code is outdated and imports an old `lib/vulnerable_utils.py` component. Can you **_debug_** it?
```python
from flask import Flask, render_template, request, jsonify
import sys
import os

# Import from local unverified library
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))
from vulnerable_utils import process_data, format_output, debug_info

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/process', methods=['POST'])
def process():
    """Process user input using third-party library"""
    try:
        data = request.json.get('data', '')
        if not data:
            return jsonify({'error': 'Missing data parameter'}), 400
        
        # Check for debug mode 
        if data == 'debug':
            return jsonify(debug_info())
        
        processed = process_data(data)
        formatted = format_output(processed)
        
        return jsonify({
            'result': formatted,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

```

=> After Examining This code , i see that 
```lua
#payload
fetch("http://10.49.170.253:5003/api/process", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ data: "test" })
})
.then(r => r.text())
.then(console.log)
```

![](content/cyber/cybersecurity-101/owasp-top-10-2025/2-application-design-flaws/_img/pasted-image-20251216171423.png)
