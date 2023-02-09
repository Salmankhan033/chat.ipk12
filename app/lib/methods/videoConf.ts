import { PermissionsAndroid } from 'react-native';
import navigation from '../navigation/appNavigation';
import openLink from './helpers/openLink';
import { isAndroid, showErrorAlert } from './helpers';
import { Services } from '../services';
import log from './helpers/log';

import i18n from '../../i18n';




export const videoConfJoin = async (callId: string, cam: boolean) => {
	try {
		const result = await Services.videoConferenceJoin(callId, cam);
		if (result.success) {
			if (isAndroid) {
				await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.CAMERA,
					PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
				]);
			}
			const { url, providerName } = result;
			if (providerName === 'jitsi') {
				navigation.navigate('JitsiMeetView', { url, onlyAudio: !cam, videoConf: true });
			} else {
				openLink(url);
			}
		}
	} catch (e) {
		showErrorAlert(i18n.t('error-init-video-conf'));
		log(e);
	}
};

export const videoConfStartAndJoin = async (rid: string, cam: boolean) => {
	try {
		const videoConfResponse: any = await Services.videoConferenceStart(rid);
		if (videoConfResponse.success) {
			videoConfJoin(videoConfResponse.data.callId, cam);
		}
	} catch (e) {
		showErrorAlert(i18n.t('error-init-video-conf'));
		log(e);
	}
};
