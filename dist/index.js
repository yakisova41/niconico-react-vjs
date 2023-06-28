import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { createContext, useState, useRef, useEffect, useContext } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
import NiconiComments from '@xpadev-net/niconicomments';

async function getInitialWatchData(videoId) {
    const iframeRes = await fetch(`https://embed.nicovideo.jp/watch/${videoId}?jsapi=1&playerId=2&noRelatedVideo=0&autoplay=1&mute=0&defaultNoComment=1&noLinkToNiconico=0&noController=0&noHeader=0&noTags=0&noShare=1&noVideoDetail=0&allowProgrammaticFullScreen=1&noIncrementViewCount=0&persistence=1&disableAdCheck=0`);
    const iframeRoot = document.createElement("div");
    iframeRoot.innerHTML = await iframeRes.text();
    const player = iframeRoot.querySelector("#ext-player");
    const iframeDataPropsText = player?.getAttribute("data-props");
    if (iframeDataPropsText !== null && iframeDataPropsText !== undefined) {
        const iframeDataProps = JSON.parse(iframeDataPropsText);
        const res = await fetch(`https://www.nicovideo.jp/api/watch/v3_guest/${videoId}?_frontendId=70&_frontendVersion=0&actionTrackId=${iframeDataProps.actionTrackId}&skips=harmful&noSideEffect=false&i18nLanguage=ja-jp&t=1685257525946`);
        const text = await res.text();
        const initialWatchData = JSON.parse(text);
        return initialWatchData;
    }
    else {
        return null;
    }
}

async function getSession(initialWatchData) {
    const res = await fetch("https://api.dmc.nico/api/sessions?_format=json", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadGenerator(initialWatchData)),
    });
    const text = await res.text();
    const sessionRes = JSON.parse(text);
    return sessionRes;
}
function payloadGenerator(initialWatchData) {
    const videoSrcIds = initialWatchData.data.media.delivery.movie.videos
        .filter(({ isAvailable }) => {
        if (isAvailable) {
            return true;
        }
    })
        .map(({ id }) => {
        return id;
    });
    const audioSrcIds = initialWatchData.data.media.delivery.movie.audios
        .filter(({ isAvailable }) => {
        if (isAvailable) {
            return true;
        }
    })
        .map(({ id }) => {
        return id;
    });
    const contentSrcIds = [];
    videoSrcIds.forEach((videoSrcId, index) => {
        if (audioSrcIds[index] !== undefined) {
            contentSrcIds.push({
                src_id_to_mux: {
                    audio_src_ids: [audioSrcIds[index]],
                    video_src_ids: [videoSrcId],
                },
            });
        }
    });
    return {
        session: {
            recipe_id: "nicovideo-" + initialWatchData.data.video.id,
            content_id: "out1",
            content_type: "movie",
            content_src_id_sets: [
                {
                    content_src_ids: contentSrcIds,
                },
            ],
            timing_constraint: "unlimited",
            keep_method: { heartbeat: { lifetime: 120000 } },
            protocol: {
                name: "http",
                parameters: {
                    http_parameters: {
                        parameters: {
                            hls_parameters: {
                                use_well_known_port: "yes",
                                use_ssl: "yes",
                                transfer_preset: "",
                                segment_duration: 6000,
                            },
                        },
                    },
                },
            },
            content_uri: "",
            session_operation_auth: {
                session_operation_auth_by_signature: {
                    token: initialWatchData.data.media.delivery.movie.session.token,
                    signature: initialWatchData.data.media.delivery.movie.session.signature,
                },
            },
            content_auth: {
                auth_type: "ht2",
                content_key_timeout: 600000,
                service_id: "nicovideo",
                service_user_id: initialWatchData.data.media.delivery.movie.session.serviceUserId,
            },
            client_info: {
                player_id: initialWatchData.data.media.delivery.movie.session.playerId,
            },
            priority: initialWatchData.data.media.delivery.movie.session.priority,
        },
    };
}

async function sendSession(session) {
    await fetch(`https://api.dmc.nico/api/sessions/${session.data.session.id}?_format=json&_method=PUT`, {
        method: "POST",
        body: JSON.stringify({ session: session.data.session }),
    });
}

const NicoSessionProvider = ({ children, videoid }) => {
    const [ready, setReady] = useState(false);
    const initialWatchData = useRef();
    const session = useRef();
    const heatBeat = useRef(null);
    useEffect(() => {
        setReady(false);
        if (heatBeat.current !== null) {
            clearInterval(heatBeat.current);
        }
        getInitialWatchData(videoid)
            .then((iData) => {
            if (iData !== null) {
                getSession(iData)
                    .then((sessionRes) => {
                    initialWatchData.current = iData;
                    session.current = sessionRes;
                    setReady(true);
                    heatBeat.current = setInterval(() => {
                        void sendSession(sessionRes);
                    }, 40000);
                })
                    .catch((e) => {
                    console.error(e);
                });
            }
        })
            .catch((e) => {
            console.error(e);
        });
    }, [videoid]);
    return (jsx(NicoDataContext.Provider, { value: {
            ready,
            initialWatchData: initialWatchData.current,
            session: session.current,
        }, children: children }));
};
const NicoDataContext = createContext({ ready: false });
const useNico = () => useContext(NicoDataContext);

const ReactVideoJSPlayer = ({ src, id, options = {}, children, className, ...props }) => {
    const player = useRef();
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        const videoElem = document.querySelector(`#${id}`);
        if (videoElem !== null) {
            player.current = videojs(videoElem, options, () => {
                setIsReady(true);
            });
        }
    }, []);
    useEffect(() => {
        player.current?.src(src);
    }, [src]);
    return (jsxs(Fragment, { children: [jsx("video", { id: id, className: (className !== undefined ? className + " " : "") + "video-js", ...props }), isReady && player.current !== undefined && (jsx(VideoJsPlayerCtx.Provider, { value: player.current, children: children }))] }));
};
const VideoJsPlayerCtx = createContext(null);
const useVideoJS = () => {
    const c = useContext(VideoJsPlayerCtx);
    if (!c)
        throw new Error("Videojs player is null");
    return c;
};

const NiconicoReactVjs = ({ videoid, children, id, className, width, height, ...props }) => {
    return (jsx("div", { className: "niconico-react-vjs", style: {
            width,
            height,
        }, children: jsx(NicoSessionProvider, { videoid: videoid, children: jsx(NicoDataContext.Consumer, { children: ({ session }) => {
                    return (jsx(ReactVideoJSPlayer, { id: id !== undefined ? id : "niconico-react-vjs", src: session?.data.session.content_uri, options: {}, className: (className !== undefined ? className + " " : "") +
                            "niconico-react-vjs-player", ...props, children: children }));
                } }) }) }));
};

const NicoReactVjsLayerItem = ({ children, enablePointerEvents }) => {
    return (jsx("div", { className: "niconico-react-vjs-layer-item" +
            (enablePointerEvents ? " niconico-react-vjs-layer-item-pointer" : ""), children: children }));
};

async function getComments(initialWatchData) {
    const data = await fetch(initialWatchData.data.comment.nvComment.server + "/v1/threads", {
        method: "POST",
        body: JSON.stringify({
            additionals: {},
            threadKey: initialWatchData.data.comment.nvComment.threadKey,
            params: initialWatchData.data.comment.nvComment.params,
        }),
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "Content-Type": "application/json",
        },
    })
        .then(async (res) => await res.text())
        .then((text) => JSON.parse(text));
    return data;
}
var Source;
(function (Source) {
    Source["Leaf"] = "leaf";
    Source["Trunk"] = "trunk";
})(Source || (Source = {}));

const Comments = ({ children, className, id }) => {
    const { initialWatchData } = useNico();
    const niconiComments = useRef();
    const commentInterval = useRef();
    const vjsPlayer = useVideoJS();
    const [isCommentShow, setCommentShow] = useState(true);
    const defaultId = "niconico-react-vjs-comment-layer";
    useEffect(() => {
        const commentLayer = document.querySelector(`#${id !== undefined ? id : defaultId}`);
        if (commentLayer === null) {
            return;
        }
        if (initialWatchData !== undefined) {
            clearInterval(commentInterval.current);
            void getComments(initialWatchData).then((commentsRes) => {
                niconiComments.current = new NiconiComments(commentLayer, commentsRes.data.threads, {
                    format: "v1",
                    scale: 1,
                    mode: "default",
                });
            });
            commentInterval.current = setInterval(() => {
                const time = vjsPlayer.currentTime();
                if (time === undefined) {
                    clearInterval(commentInterval.current);
                    return;
                }
                niconiComments.current?.drawCanvas(Math.floor(time * 100));
            }, 10);
        }
    }, [initialWatchData]);
    return (jsxs(CommentContext.Provider, { value: {
            enable: () => {
                setCommentShow(true);
            },
            disable: () => {
                setCommentShow(false);
            },
            get: () => isCommentShow,
        }, children: [jsx("canvas", { id: id !== undefined ? id : defaultId, className: (isCommentShow ? "" : "niconico-react-vjs-comment-hide ") +
                    (className !== undefined ? className + " " : "") +
                    "niconico-react-vjs-comment niconico-react-vjs-layer-item", width: 1920, height: 1080 }), children] }));
};
const CommentContext = createContext(undefined);
const useComment = () => {
    const c = useContext(CommentContext);
    if (!c)
        throw new Error("Comment context is undefined!!");
    return c;
};

export { Comments, NicoReactVjsLayerItem, NiconicoReactVjs, useComment, useVideoJS };
