import {gql} from '@apollo/client';
import {useQuery, useMutation, useLazyQuery} from '@apollo/client';

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
      createdAt
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
      pushEnabled
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
    diaries(
      pageInput: {diaryOffset: 0, diarySize: 1000, pageOffset: 0, pageSize: 3}
    ) {
      id
      title
      invitationCode
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

const UPDATE_DIARY_TITLE = gql`
  mutation updateDiary($diaryId: Long!, $title: String) {
    updateDiary(updateDiaryInput: {diaryId: $diaryId, title: $title})
  }
`;

const UPDATE_DIARY_COLOR = gql`
  mutation updateDiary($diaryId: Long!, $colorId: Long!) {
    updateDiary(updateDiaryInput: {diaryId: $diaryId, colorId: $colorId})
  }
`;

const EXIT_DIARY = gql`
  mutation outDiary($diaryId: Long!) {
    outDiary(outDiaryInput: {diaryId: $diaryId})
  }
`;

const LOOK_UP_HISTORY_PAGE = gql`
  query histories($diaryId: Long!) {
    histories(
      diaryId: $diaryId
      pageInput: {
        historyOffset: 0
        historySize: 1000
        pageOffset: 0
        pageSize: 1000
      }
    ) {
      id
      startDate
      diary {
        title
      }
      endDate
      remainingDays
      pages {
        id
        title
        isSelf
        author {
          nickname
        }
        images {
          id
          domain
          path
        }
        createdAt
      }
    }
  }
`;

const CREATE_PAGE = gql`
  mutation createPage(
    $title: String!
    $body: String!
    $historyId: Long!
    $imageUrls: [String]!
  ) {
    createPage(
      createPageInput: {
        title: $title
        body: $body
        historyId: $historyId
        imageUrls: $imageUrls
      }
    ) {
      id
      title
      body
    }
  }
`;

const LOOK_UP_PUSH_HISTORY = gql`
  query {
    alarmHistories {
      id
      body
      isRead
      createdAt
    }
  }
`;

const GET_PAGE = gql`
  query GetPage($id: Long!) {
    page(pageQueryInput: {id: $id}) {
      id
      title
      body
      images {
        id
        path
        domain
      }
    }
  }
`;

const DELETE_PAGE = gql`
  mutation deletePage($pageId: Long!) {
    deletePage(deletePageInput: {pageId: $pageId})
  }
`;

const EDIT_PAGE = gql`
  mutation editPage(
    $pageId: Long!
    $title: String!
    $body: String!
    $imageUrls: [String]
  ) {
    editPage(
      editPageInput: {
        pageId: $pageId
        title: $title
        body: $body
        imageUrls: $imageUrls
      }
    ) {
      id
      title
      body
      images {
        path
      }
    }
  }
`;

const READ_PUSH_HISTORY = gql`
  mutation readAlarmHistories($alarmHistoryIds: [Long]!) {
    readAlarmHistories(
      readAlarmHistoriesInput: {alarmHistoryIds: $alarmHistoryIds}
    )
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
  UPDATE_DIARY_TITLE: UPDATE_DIARY_TITLE,
  UPDATE_DIARY_COLOR: UPDATE_DIARY_COLOR,
  EXIT_DIARY: EXIT_DIARY,
  LOOK_UP_HISTORY_PAGE: LOOK_UP_HISTORY_PAGE,
  CREATE_PAGE: CREATE_PAGE,
  GET_PAGE: GET_PAGE,
  DELETE_PAGE: DELETE_PAGE,
  EDIT_PAGE: EDIT_PAGE,
  LOOK_UP_PUSH_HISTORY: LOOK_UP_PUSH_HISTORY,
  READ_PUSH_HISTORY: READ_PUSH_HISTORY,
};

export const USE_QUERY = (Query, Token, variable) => {
  return useQuery(QUERY_ARRAY[Query], {
    context: {
      headers: {
        authorization: `Bearer ${Token}`,
        'Content-Type': 'application/json',
      },
    },
    variables: variable,
  });
};

export const USE_LAZY_QUERY = (Query, Token) => {
  return useLazyQuery(QUERY_ARRAY[Query], {
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
