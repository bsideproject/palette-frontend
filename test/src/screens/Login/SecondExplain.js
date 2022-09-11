import React from 'react';
import styled from 'styled-components/native';
import {WebView} from 'react-native-webview';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const ExplainContainer = styled.View`
  padding: 34px 16px 0 16px;
`;

const ExplainText = styled.Text`
  font-family: ${({theme}) => theme.fontLight};
  font-size: 14px;
  color: ${({theme}) => theme.dark020};
  margin-bottom: 20px;
`;

const SecondExplain = ({navigation, route}) => {
  const {params} = route;

  return params ? (
    <WebView
      source={{
        uri: 'https://bitter-humerus-381.notion.site/78bd4572662f4c8ab653fcce4579639b',
      }}
    />
  ) : (
    <Container>
      <ExplainContainer>
        <ExplainText>
          제1조 (개인정보의 수집 및 이용목적){'\n'}Team Palette(이하 “단체”)가
          운영하는 ‘반쪽일기’는 통신비밀보호법, 전기통신사업법, 정보통신망
          이용촉진 및 정보보호 등에 관한 법률 등 정보통신서비스제공자가
          준수하여야 할 관련 법령상의 개인정보보호 규정을 준수하며, 관련 법령에
          의거한 개인정보취급방침을 정하여 이용자 권익 보호에 최선을 다하고
          있습니다.
        </ExplainText>
        <ExplainText>
          제2조 (수집하는 개인정보의 항목 및 수집방법){'\n'}① 수집하는
          개인정보의 항목 {'\n'}&nbsp;&nbsp;• 소셜 로그인 정보 : 이메일(필수), 성별(선택),
          생년월일(선택) {'\n'}&nbsp;&nbsp;• 닉네임, 서비스 이용기록, 접속로그, 쿠키 등{' '}
          {'\n'}② 개인정보 수집방법 {'\n'}&nbsp;&nbsp;• 회원가입(소셜 로그인 정보를 전달
          받음), 피드백 전송을 통한 수집 {'\n'}&nbsp;&nbsp;• 서비스 이용 중 사용자의 자발적
          제공을 통한 수집
        </ExplainText>
        <ExplainText>
          제3조 (개인정보의 활용){'\n'}다음의 목적을 위해 수집된 개인정보가
          활용합니다. {'\n'}&nbsp;&nbsp;• 회원 관리 회원제 서비스 이용에 따른 본인 확인,
          개인 식별, 불량 회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사
          확인, 불만 처리 등 민원 처리, 고지 사항 전달 {'\n'}&nbsp;&nbsp;• 마케팅 및 광고에
          활용, 신규 서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달,
          인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 접속 빈도 파악 또는
          회원의 서비스 이용에 대한 통계
        </ExplainText>
        <ExplainText>
          제4조 (개인정보의 보유 및 이용기간){'\n'}① 단체는 법령에 따른 개인정보
          보유 이용기간 또는 이용자로부터 개인정보를 수집 시에 동의받은 개인정보
          보유 이용기간 내에서 개인정보를 처리 보유합니다. {'\n'}② 회원 정보는
          사용자가 별별동네 탈퇴 시까지 보유 및 관리를 합니다. {'\n'}③ 회원탈퇴
          후에도 관계법령의 규정에 의하여 보존할 필요가 있는 경우 법령에 따라
          일정기간 회원정보를 보관합니다. {'\n'}&nbsp;&nbsp;• 이메일, 성별, 생년월일,
          닉네임, 서비스 이용기록, 접속로그, 쿠키 등 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦ 보존 이유 :
          전자상거래등에서의 소비자보호에 관한 법률 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦ 보존 기간 : 5년{' '}
          {'\n'}&nbsp;&nbsp;• 방문에 관한 기록 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦ 보존 이유 : 통신비밀보호법 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦
          보존 기간 : 3개월 {'\n'}&nbsp;&nbsp;• 표시/광고에 관한 기록 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦ 보존 이유 :
          전자상거래등에서의 소비자보호에 관한 법률 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦ 보존 기간 : 6개월{' '}
          {'\n'}&nbsp;&nbsp;• 계약 또는 청약 철회 등에 관한 기록 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦ 보존 이유 :
          전자상거래등에서의 소비자보호에 관한 법률 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦ 보존 기간 : 5년{' '}
          {'\n'}&nbsp;&nbsp;• 소비자의 불만 또는 분쟁처리에 관한 기록 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦ 보존 이유 :
          전자상거래등에서의 소비자보호에 관한 법률 {'\n'}&nbsp;&nbsp;&nbsp;&nbsp;◦ 보존 기간 : 3년
        </ExplainText>
        <ExplainText>
          제5조 (개인정보의 파기절차 및 방법){'\n'}① 이용자는 단체에 대해
          언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할
          수 있습니다.{'\n'}② 제1항에 따른 권리 행사는 에 대해 개인정보보호법
          시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하 여
          하실 수 있으며, 단체는 이에 대해 지체없이 조치하겠습니다.{'\n'}③
          제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등
          대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙
          별지 제11호 서식에 따른 위임장을 제출하셔야합니다.{'\n'}④ 개인정보
          열람 및 처리정지 요구는 개인정보보호법 제35조 제5항, 제37조 제2항에
          의하여 정보주체의 권리가 제한 될 수 있습니다.{'\n'}⑤ 개인정보의 정정
          및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는
          경우에는 그 삭제를 요구할 수 없습니다.{'\n'}⑥ 단체는 정보주체 권리에
          따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를
          한 자가 본인이거나 정당한 대리인인지를 확인합니다.
        </ExplainText>
        <ExplainText>
          제6조 (개인정보관리책임자 및 담당자의 연락처){'\n'}① 개인 정보 보호
          책임자 {'\n'}&nbsp;&nbsp;• i. 성명 : 권지효 {'\n'}&nbsp;&nbsp;• ii. 직책 : 프로젝트 매니저{' '}
          {'\n'}&nbsp;&nbsp;• iii. 연락처 : teampalette811@gmail.com {'\n'}② 기타 개인 정보
          침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기
          바랍니다. {'\n'}&nbsp;&nbsp;• i.
          개인정보침해신고센터([https://privacy.kisa.or.kr](https://privacy.kisa.or.kr/) /
          국번 없이 118) {'\n'}&nbsp;&nbsp;• ii. 대검찰청
          사이버범죄수사단([http://www.spo.go.kr](http://www.spo.go.kr/) /
          02-3480-2000) {'\n'}&nbsp;&nbsp;• iii. 경찰청
          사이버테러대응센터([http://www.cyber.go.kr](http://www.cyber.go.kr/) /
          1566-0112)
        </ExplainText>
        <ExplainText>
          제7조 (고지의 의무){'\n'}현 개인정보취급방침의 내용 추가, 삭제 및
          수정이 있을 시에는 시행 일자 최소 7일 전부터 서비스 내 공지사항을 통해
          공고할 것입니다.
        </ExplainText>
      </ExplainContainer>
    </Container>
  );
};

export default SecondExplain;
