import React from 'util/safe-react';

import { SoundPlayerContainer } from 'react-soundplayer/addons';
import { PlayButton, Progress } from 'react-soundplayer/components';

const clientId = '8bb2e7ee7072210ee5c86a7f13ab7897';

class CustomPlayer extends React.Component {

    render() {
        let { track, currentTime, duration } = this.props;

        if (!track) {
            return <div></div>;
        }

        return (
            <div className="col-lg-12 col-xs-12">
                <div className="row">
                    <PlayButton
                        className="col-lg-1 col-xs-2 button-outline bg-orange" {...this.props} />

                <div className="col-lg-11 col-xs-10">
                    <Progress
                        className=" rounded"
                        innerClassName="rounded-left"
                        value={currentTime / duration * 100 || 0}
                        {...this.props}
                    />
                </div>
                </div>
            </div>
        );
    }
}

class XSoundcloud extends React.Component {
    render() {

        let { permalink_url} = this.props;

        return (
            <SoundPlayerContainer resolveUrl={permalink_url} clientId={clientId}>
                <CustomPlayer />
            </SoundPlayerContainer>
        );
    }
}

export { XSoundcloud }