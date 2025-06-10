# TEDxNTUA Archive

Archived versions of the TEDxNTUA websites from 2015, 2017, 2018, and 2019.

## Preview links

- [2015](https://2015.tedxntua.tdiam.me)
- [2017](https://2017.tedxntua.tdiam.me)
- [2018](https://2018.tedxntua.tdiam.me)
- [2019](https://2019.tedxntua.tdiam.me)

## Notes

The process to archive each website was:

- Clone repository, fix and update dependencies and run locally.
- Render as HTML output via [HTTrack](https://www.httrack.com/).
- Manually fix URLs when missing or for localization (i.e. moving to static HTML means we cannot rely on language cookies but need to hardcode URLs as `/en/*` and `/el/*`).
- Remove tracking, cookie banners, CSRF tokens, contact forms, or other functionality that is obsolete or broken without a backend.

## Roadmap

- [ ] Archive https://github.com/TEDxNTUA/tedxntua2020 and recover images.
- [ ] Move to https://github.com/TEDxNTUA/tedxntua-archive/
- [ ] Republish as {year}.tedxntua.com

See https://github.com/TEDxNTUA/tedxntua-archive/issues/17
