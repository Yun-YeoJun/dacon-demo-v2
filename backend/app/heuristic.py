import re
from .models import AnalyzeResult

URL_RE = re.compile(r"https?://\S+|www\.\S+|bit\.ly/\S+|t\.co/\S+", re.IGNORECASE)

SMISHING_PATTERNS = [
    ("정부기관 사칭", re.compile(r"(검찰|경찰|금감원|국세청|법원|정부|수사)", re.IGNORECASE)),
    ("금전 요구", re.compile(r"(송금|입금|계좌|돈|현금|상품권|기프티콘|수수료|보증금|대출)", re.IGNORECASE)),
    ("긴급성/압박", re.compile(r"(긴급|즉시|당장|오늘까지|지금바로|미납|정지|차단)", re.IGNORECASE)),
    ("택배/배송 사칭", re.compile(r"(택배|배송|주소|부재|물품|도착|운송장)", re.IGNORECASE)),
    ("인증/로그인 유도", re.compile(r"(인증|로그인|본인확인|비밀번호|OTP|보안카드)", re.IGNORECASE)),
]

def analyze_text(text: str) -> AnalyzeResult:
    patterns = []
    score = 0.1
    explanation_bits = []

    if URL_RE.search(text):
        patterns.append("URL 포함")
        score += 0.35
        explanation_bits.append("문자에 외부 링크가 포함되어 있습니다.")

    for name, rx in SMISHING_PATTERNS:
        if rx.search(text):
            patterns.append(name)
            score += 0.15
            explanation_bits.append(f"'{name}' 관련 표현이 감지되었습니다.")

    score = max(0.0, min(0.99, score))
    label = "정상"
    if score >= 0.6:
        label = "스미싱"
    elif score >= 0.4:
        label = "불명"

    recommended = []
    if label == "스미싱":
        recommended = ["링크 클릭 금지", "발신자 공식 채널 확인", "의심 시 신고"]
    elif label == "불명":
        recommended = ["링크 클릭 전 발신자 확인", "의심되면 신고"]
    else:
        recommended = ["필요 시 발신자 확인"]

    return AnalyzeResult(
        label=label,
        score=round(score, 2),
        explanation=" ".join(explanation_bits) if explanation_bits else "의심 패턴이 뚜렷하지 않습니다.",
        patterns=patterns,
        recommended_actions=recommended,
        raw_output=None,
    )
