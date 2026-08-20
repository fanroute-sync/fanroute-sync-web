export const termsFixtures = {
  service: { title: '이용약관', sections: [{ heading: '서비스 이용', content: 'Fan Route Sync는 부산 콘서트 여행 일정 추천과 커뮤니티 기능을 제공합니다.' }, { heading: '이용자의 책임', content: '이용자는 정확한 정보를 입력하고 다른 이용자를 존중해야 합니다.' }] },
  privacy: { title: '개인정보처리방침', sections: [{ heading: '수집하는 정보', content: '서비스 제공을 위해 소셜 로그인 식별 정보, 닉네임과 선택한 프로필 이미지를 처리합니다.' }, { heading: '정보의 이용', content: '수집한 정보는 로그인, 일정 저장과 커뮤니티 활동 제공에만 사용합니다.' }] },
} as const;
export type TermsType = keyof typeof termsFixtures;
