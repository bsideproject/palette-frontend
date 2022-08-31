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
      socialTypes
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
    $socialTypes: [String!]
  ) {
    editMyProfile(
      editMyProfileInput: {
        nickname: $nickname
        agreeWithTerms: $agreeWithTerms
        profileImg: $profileImg
        socialTypes: $socialTypes
      }
    ) {
      id
      email
      nickname
      profileImg
      socialTypes
      agreeWithTerms
      createdAt
    }
  }
`;

const REGISTER_DIARY_PERIOD = gql`
  mutation createHistory($diaryId: Long!, $period: Int!) {
    createHistory(createHistoryInput: {diaryId: $diaryId, period: $period}) {
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

const DELETE_FCM_TOKEN = gql`
  mutation DeleteFCMToken($token: String!) {
    deleteFcmToken(deleteFcmTokenInput: {token: $token})
  }
`;

const LOOK_UP_DIARY_PAGE = gql`
  query {
    diaries {
      id
      title
      color {
        startCode
        endCode
      }
      joinedUsers {
        nickname
      }
      currentHistory {
        remainingDays
        pages {
          id
          title
          body
          isSelf
          createdAt
          author {
            profileImg
          }
        }
        id
      }
      diaryStatus
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
  DELETE_FCM_TOKEN: DELETE_FCM_TOKEN,
  LOOK_UP_DIARY_PAGE: LOOK_UP_DIARY_PAGE,
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
