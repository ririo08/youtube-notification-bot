// cSpell:disable

/**
 * ニコニコ動画API
 */
export interface SearchNicoNicoMovieResponse {
  /** レスポンスのメタ情報 */
  meta: {
    /** レスポンスのステータスコード */
    status: number
  }
  /** レスポンスのデータ部分 */
  data: {
    /** レスポンス内のアイテムの総数 */
    totalCount: number
    /** レスポンス内のアイテム（動画）のリスト */
    items: {
      /** 動画が属するシリーズに関する情報 */
      series: {
        /** シリーズのID */
        id: number
        /** シリーズのタイトル */
        title: string
        /** シリーズの順序 */
        order: number
      }
      /** 動画の主要な情報 */
      essential: {
        /** コンテンツの種類（例: essential） */
        'type': string
        /** 動画のID */
        'id': string
        /** 動画のタイトル */
        'title': string
        /** 動画の登録日時 */
        'registeredAt': string
        /** 動画に関連するカウント情報 */
        'count': {
          /** 視聴数 */
          view: number
          /** コメント数 */
          comment: number
          /** マイリストに追加された数 */
          mylist: number
          /** いいね数 */
          like: number
        }
        /** 動画のサムネイル情報 */
        'thumbnail': {
          /** サムネイル画像のURL */
          url: string
          /** 中サイズのサムネイル画像のURL */
          middleUrl: string
          /** 大サイズのサムネイル画像のURL */
          largeUrl: string
          /** リスティング用サムネイル画像のURL */
          listingUrl: string
          /** nHd（高解像度）サムネイル画像のURL */
          nHdUrl: string
        }
        /** 動画の再生時間（秒単位） */
        'duration': number
        /** 動画の短い説明文 */
        'shortDescription': string
        /** 最新のコメントの概要 */
        'latestCommentSummary': string
        /** 動画がチャンネル動画かどうか */
        'isChannelVideo': boolean
        /** 動画の視聴に支払いが必要かどうか */
        'isPaymentRequired': boolean
        /** 再生位置（nullの場合あり） */
        'playbackPosition': number | null
        /** 動画の所有者情報 */
        'owner': {
          /** 所有者の種類（例: ユーザー、チャンネル） */
          ownerType: string
          /** 所有者の種類（typeと同じ値が繰り返されています） */
          type: string
          /** 所有者の表示ステータス */
          visibility: string
          /** 所有者のID */
          id: string
          /** 所有者の名前 */
          name: string
          /** 所有者のアイコン画像のURL */
          iconUrl: string
        }
        /** 動画に敏感なコンテンツのマスキングが必要かどうか */
        'requireSensitiveMasking': boolean
        /** ライブ動画に関する情報（該当しない場合はnull） */
        'videoLive': any | null
        /** 動画がミュートされているかどうか */
        'isMuted': boolean
        /** カスタムフラグ（内部使用の可能性あり） */
        '9d091f87': boolean
        /** 別のカスタムフラグ（内部使用の可能性あり） */
        'acf68865': boolean
      }
    }[]
  }
}

/**
 * ニコニコ生放送API
 */
export interface SearchNicoNicoLiveResponse {
  /** レスポンスのメタ情報 */
  meta: {
    /** レスポンスのステータスコード */
    status: number
  }
  /** レスポンスのデータ部分 */
  data: {
    /** プログラムのリスト */
    programsList: Array<{
      /** プログラムのID情報 */
      id: {
        /** IDの値 */
        value: string
      }
      /** 公開ステータス（例: 0 = 非公開） */
      publicStatus: number
      /** 視聴制限に関する情報 */
      audienceLimitation: {
        /** ログイン制限の種類（例: NO_LIMIT） */
        loginLimitation: string
      }
      /** プログラムの機能情報 */
      features: {
        /** 有効化された機能のリスト */
        enabledList: string[]
      }
      /** 好みに関するタグ情報 */
      konomiTags: {
        /** タグのリスト */
        itemsList: Array<{
          /** タグのテキスト */
          text: string
          /** ニコペディアのID */
          nicopediaId: number
          /** ニコペディアのURL */
          nicopediaUrl: string
        }>
      }
      /** プログラムの詳細情報 */
      program: {
        /** プログラムのタイトル */
        title: string
        /** プログラムの説明 */
        description: string
        /** プロバイダー情報 */
        provider: string
        /** スケジュールに関する情報 */
        schedule: {
          /** スケジュールのステータス */
          status: string
          /** オープン時間 */
          openTime: {
            /** 秒数 */
            seconds: number
            /** ナノ秒数 */
            nanos: number
          }
          /** 開始時間 */
          beginTime: {
            /** 秒数 */
            seconds: number
            /** ナノ秒数 */
            nanos: number
          }
          /** 予定終了時間 */
          scheduledEndTime: {
            /** 秒数 */
            seconds: number
            /** ナノ秒数 */
            nanos: number
          }
          /** 終了時間 */
          endTime: {
            /** 秒数 */
            seconds: number
            /** ナノ秒数 */
            nanos: number
          }
          /** VPOSベース時間 */
          vposBaseTime: {
            /** 秒数 */
            seconds: number
            /** ナノ秒数 */
            nanos: number
          }
        }
        /** 追加の説明情報 */
        additionalDescriptions: Record<string, any>
      }
      /** プログラム提供者に関する情報 */
      programProvider: {
        /** プロバイダーの種類 */
        type: string
        /** プロバイダーの名前 */
        name: string
        /** プロフィールURL */
        profileUrl: string
        /** プログラムプロバイダーID */
        programProviderId: {
          /** IDの値 */
          value: string
        }
        /** アイコン画像のURL情報 */
        icons: {
          /** 150x150ピクセルのアイコン画像のURL */
          uri150x150: string
          /** 50x50ピクセルのアイコン画像のURL */
          uri50x50: string
        }
        /** ユーザーレベル */
        userLevel: {
          /** ユーザーレベルの値 */
          value: number
        }
        /** スタンダードアカウントかどうか */
        isStandardAccount: {
          /** スタンダードアカウントかを示す値 */
          value: boolean
        }
        /** プロバイダーの説明 */
        description: {
          /** 説明文の値 */
          value: string
        }
      }
      /** ソーシャルグループに関する情報 */
      socialGroup: {
        /** ソーシャルグループID */
        socialGroupId: string
        /** ソーシャルグループの種類 */
        type: string
        /** ソーシャルグループの名前 */
        name: string
        /** ソーシャルグループの説明 */
        description: string
        /** サムネイル画像のURL */
        thumbnail: string
        /** 小サイズのサムネイル画像のURL */
        thumbnailSmall: string
        /** サムネイルが安全かどうか */
        isSafeThumbnail: {
          /** 安全性を示す値 */
          value: boolean
        }
        /** ソーシャルグループのレベル */
        level: {
          /** レベルの値 */
          value: number
        }
        /** フォローしているかどうか */
        isFollowed: boolean
        /** 参加しているかどうか */
        isJoined: boolean
        /** 削除されているかどうか */
        isDeleted: {
          /** 削除されているかを示す値 */
          value: boolean
        }
      }
      /** 統計情報 */
      statistics: {
        /** 視聴者数 */
        viewers: {
          /** 視聴者数の値 */
          value: number
        }
        /** コメント数 */
        comments: {
          /** コメント数の値 */
          value: number
        }
      }
      /** タグやカテゴリに関する分類情報 */
      taxonomy: {
        /** タグ情報 */
        tags: {
          /** タグのリスト */
          itemsList: Array<{
            /** タグのテキスト */
            text: string
            /** タグがロックされているか */
            locked: boolean
            /** タグが予約されているか */
            reserved: boolean
            /** ニコペディア記事のURL（オプション） */
            nicopediaArticleUrl?: {
              /** URLの値 */
              value: string
            }
          }>
          /** 所有者がロックしているかどうか */
          ownerLocked: boolean
        }
        /** カテゴリ情報 */
        categories: {
          /** メインカテゴリのリスト */
          mainList: Array<{
            /** カテゴリのテキスト */
            text: string
            /** ニコペディア記事のURL */
            nicopediaArticleUrl: {
              /** URLの値 */
              value: string
            }
          }>
          /** サブカテゴリのリスト */
          subList: Array<Record<string, any>>
        }
      }
      /** サムネイルに関する情報 */
      thumbnail: {
        /** スクリーンショット情報 */
        screenshot: {
          /** 大サイズのスクリーンショットURL */
          large: string
          /** 中サイズのスクリーンショットURL */
          middle: string
          /** 小サイズのスクリーンショットURL */
          small: string
          /** マイクロサイズのスクリーンショットURL */
          micro: string
        }
        /** リスティング画像情報 */
        listing: {
          /** 大サイズのリスティング画像URL */
          large: {
            /** URLの値 */
            value: string
          }
          /** 中サイズのリスティング画像URL */
          middle: string
        }
      }
      /** タイムシフト設定に関する情報 */
      timeshiftSetting: {
        /** 視聴制限 */
        watchLimit: string
        /** 視聴の条件 */
        requirement: string
        /** タイムシフトのステータス */
        status: string
        /** タイムシフト終了時間 */
        endTime: {
          /** 秒数 */
          seconds: number
          /** ナノ秒数 */
          nanos: number
        }
        /** 予約締切時間 */
        reservationDeadline: {
          /** 秒数 */
          seconds: number
          /** ナノ秒数 */
          nanos: number
        }
      }
      /** 編集可能な日数 */
      editableDays: number
    }>
    /** 次のページがあるかどうか */
    hasNext: boolean
    /** アイテムの総数 */
    totalCount: number
  }
}
