export class CreateProjectDto {
    domainTech?: string;
    domainCustom?: string;
    name?: string;
    type?: string;
    status?: string;
    owner?: string;
    db?: {
      mongo?: { uri: string; name: string };
    };
}
