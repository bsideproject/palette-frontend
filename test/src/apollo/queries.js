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
      pushEnabled
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
    $pushEnabled: Boolean
  ) {
    editMyProfile(
      editMyProfileInput: {
        nickname: $nickname
        agreeWithTerms: $agreeWithTerms
        profileImg: $profileImg
        socialTypes: $socialTypes
        pushEnabled: $pushEnabled
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

const UPDATE_DIARY = gql`
  mutation updateDiary($diaryId: Long!, $title: String!, $colorId: String!) {
    updateDiary(
      updateDiaryInput: {diaryId: $diaryId, title: $title, colorId: 3}
    )
  }
`;

const EXIT_DIARY = gql`
  mutation outDiary($diaryId: Long!) {
    outDiary(outDiaryInput: {diaryId: $diaryId})
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
  UPDATE_DIARY: UPDATE_DIARY,
  EXIT_DIARY: EXIT_DIARY,
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
