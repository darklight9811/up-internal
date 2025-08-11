import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { configureSynced } from "@legendapp/state/sync";

export const syncer = configureSynced({
	persist: {
		plugin: ObservablePersistLocalStorage,
		retrySync: true,
	},
	retry: {
		infinite: true,
		backoff: "exponential",
		maxDelay: 60,
	},
	debounceSet: 1200,
});
