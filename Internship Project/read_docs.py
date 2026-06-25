import zipfile
import xml.etree.ElementTree as ET
import glob
import os

def read_docx(path):
    text = []
    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.XML(xml_content)
            for elem in tree.iter():
                if elem.tag == '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t':
                    if elem.text:
                        text.append(elem.text)
        return ' '.join(text)
    except Exception as e:
        return f"Error reading {path}: {e}"

os.chdir(r"c:\Users\Ashruth\Downloads\Internship Project(Backend)")
for f in glob.glob("*.docx"):
    print(f"--- {f} ---")
    print(read_docx(f))
    print("\n" + "="*50 + "\n")
