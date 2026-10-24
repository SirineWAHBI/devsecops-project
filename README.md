# DevSecOps pipeline: Angular + Spring Boot on GitLab CI

Security controls integrated into a GitLab CI/CD pipeline, from the developer's commit to a staging deployment. Academic project at ESPRIT, done as a pair.

> The pipeline runs on GitLab (`.gitlab-ci.yml`) with a local Windows runner.
> This GitHub repository is a copy of the code and documentation. GitHub Actions is not used.

## Application

- Frontend: Angular, served by nginx in a Docker container
- Backend: Spring Boot (Java, Maven)

## Security controls

| Control | Tool | Blocks when |
|---|---|---|
| Pre-commit hooks | Semgrep, Gitleaks | any finding |
| Secrets | Gitleaks | any secret in the files |
| SAST | Semgrep (custom rule `no-eval-usage` + OWASP Top 10 + TypeScript) | any finding |
| SCA (npm) | npm audit | high severity or above |
| SCA (Maven) | OWASP Dependency-Check | CVSS >= 7 |
| Image scan | Trivy (vulnerabilities and secrets) | HIGH or CRITICAL |
| Deployment | Docker staging container | only if all controls above pass |
| DAST | OWASP ZAP baseline | FAIL, or WARN not justified in `.zap/rules.tsv` |

Every job publishes its report as an artifact, and Discord alerts the team when a pipeline fails.

## How the quality gate was tested

Each control was tested with a deliberate flaw on a throwaway branch (a fake token and an `eval()` call):

- `secret_detection` and `sast` failed
- `deploy_staging` and `dast` were skipped, so nothing was deployed

The standard `p/owasp-top-ten` ruleset did not report the `eval()`, while the custom rule in `semgrep-rules/no-eval.yml` did.

## DAST results and false positives

The ZAP baseline scan reported no High or Medium alert. Each remaining alert was analysed and either fixed or justified in `.zap/rules.tsv` (for example, `bypassSecurityTrustHtml` is only the definition inside Angular's own runtime, with no call in the application code).

## Reproduce

Prerequisites: Git, Docker, Node.js, Java with the Maven wrapper, Semgrep, Gitleaks, Trivy, pre-commit, and a GitLab runner.

1. Adjust the tool paths in `.pre-commit-config.yaml` and `.gitlab-ci.yml`.
2. Define the masked CI variable `NVD_API_KEY` (OWASP Dependency-Check).
3. Run `pre-commit install` to enable the local hooks.
4. Push to GitLab to run the pipeline.

