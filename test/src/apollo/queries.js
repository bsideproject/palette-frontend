import {gql} from '@apollo/client';
import {useQuery, useMutation} from '@apollo/client';

// Query
const COLOR_CODE = gql`
  query ColorCode {
    colors {
      id
      startCode
      endCode
      order
    }
  }
`;

const REGISTER_MEMO = gql`
  mutation CreateDiary($title: String!, $colorId: Long!) {
    createDiary(createDiaryInput: {title: $title, colorId: $colorId}) {
      invitationCode
    }
  }
`;

const SET_INVITE_CODE = gql`
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

const GET_PROFILE = gql`
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

const UPDATE_PROFILE = gql`
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

const REGISTER_DIARY_PERIOD = gql`
  mutation RegisterDiaryDate($diaryId: Long!, $period: Long!) {
    updateDiaryDate(diaryDateInput: {diaryId: $diaryId, period: $period}) {
      historyId
    }
  }
`;

const ADD_FCM_TOKEN = gql`
  mutation AddFCMToken($token: String!) {
    addFcmToken(addFcmTokenInput: {token: $token}) {
      id
      email
      nickname
      profileImg
      agreeWithTerms
      createdAt
    }
  }
`;

// ---------------------------------------------------------
const QUERY_ARRAY = {
  COLOR_CODE: COLOR_CODE,
  REGISTER_MEMO: REGISTER_MEMO,
  SET_INVITE_CODE: SET_INVITE_CODE,
  GET_PROFILE: GET_PROFILE,
  UPDATE_PROFILE: UPDATE_PROFILE,
  REGISTER_DIARY_PERIOD: REGISTER_DIARY_PERIOD,
  ADD_FCM_TOKEN: ADD_FCM_TOKEN,
};

export const USE_QUERY = (Query, Token) => {
  return useQuery(QUERY_ARRAY[Query], {
    context: {
      headers: {
        authorization: `Bearer ${Token}`,
        'Content-Type': 'application/json',
      },
    },
  });
};

export const USE_MUTATION = (Query, Token) => {
  return useMutation(QUERY_ARRAY[Query], {
    context: {
      headers: {
        authorization: `Bearer ${Token}`,
        'Content-Type': 'application/json',
      },
    },
  });
};
