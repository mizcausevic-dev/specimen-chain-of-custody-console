`specimen-chain-of-custody-console` has two layers:

1. an offline analyzer and CLI
   - reads synthetic specimen-custody snapshot packets
   - identifies labeling drift, cold-chain excursions, custody-signoff gaps, storage mismatches, consent staleness, and transport seal gaps

2. a public operator surface
   - turns the same findings into custody-lane, transfer-gaps, and release-posture views
   - keeps the proof buyer-readable without exposing live lab systems
