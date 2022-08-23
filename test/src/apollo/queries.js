import {gql} from '@apollo/client';

// Query
export const COLOR_CODE = gql`
  query ColorCode {
    colors {
      id
      startCode
      endCode
      order
    }
  }
`;

export const REGISTER_MEMO = gql`
  mutation CreateDiary($title: String!, $colorId: Long!) {
    createDiary(createDiaryInput: {title: $title, colorId: $colorId}) {
      invitationCode
    }
  }
`;

export const SET_INVITE_CODE = gql`
  mutation SetInviteCode($InviteCode: String!) {
    inviteDiary(inviteDiaryInput: {invitationCode: $InviteCode}) {
      adminUser {
        nickname
      }
      diary {
        title
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query {
    myProfile {
      id
      email
      nickname
      profileImg
      diaries {
        title
        invitationCode
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation EditMyProfile(
    $nickname: String
    $agreeWithTerms: Boolean
    $profileImg: String
  ) {
    editMyProfile(
      editMyProfileInput: {
        nickname: $nickname
        agreeWithTerms: $agreeWithTerms
        profileImg: $profileImg
      }
    ) {
      id
      email
      nickname
      profileImg
      agreeWithTerms
      createdAt
    }
  }
`;
